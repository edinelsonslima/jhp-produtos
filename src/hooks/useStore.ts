import { useSyncExternalStore } from "react";

type SetterStateFn<T> = (state: T) => Partial<T>;
type CreateStateFn<T> = (
  setState: (partialState: Partial<T> | SetterStateFn<T>) => void,
  getState: () => T,
) => T;

interface Store {
  createState: CreateStateFn<any>;
  persist?: {
    key: string;
    expiresIn?: number;
  };
}

export function createStore<TState extends Record<string | number, unknown>>({
  createState,
  persist,
}: Store) {
  // TODO: Implement persistence logic using the provided key and expiresIn values. This will likely involve using localStorage or a similar mechanism to save and load the state, and setting up a timer to handle expiration if expiresIn is provided.
  let state: TState;
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const updateState = (value: Partial<TState>) => {
    state = {
      ...state,
      ...value,
    };

    notify();
  };

  const setState = (partialState: Partial<TState> | SetterStateFn<TState>) => {
    if (typeof partialState === "function") {
      updateState(partialState(state));
      return;
    }

    updateState(partialState);
  };

  const getState = () => {
    return state;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  state = createState(setState, getState);

  const useStore = <TValue>(selector: (currentState: TState) => TValue) => {
    return useSyncExternalStore(subscribe, () => selector(state));
  };

  return {
    useStore,
    getState,
    setState,
    subscribe,
  };
}
