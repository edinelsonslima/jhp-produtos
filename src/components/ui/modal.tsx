import {
  Children,
  ComponentProps,
  createContext,
  createElement,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useContext,
  useRef,
} from "react";

interface ModalContextValue {
  ref: RefObject<HTMLDialogElement | null>;
}

const ModalContext = createContext<ModalContextValue>({
  ref: { current: null },
});

export function Modal({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDialogElement>(null);

  let trigger: ReactNode;
  const childrenWithoutTrigger = Children.map(children, (child) => {
    if (isValidElement(child) && Modal.Trigger === child.type) {
      trigger = child;
      return null;
    }

    return child;
  });

  return (
    <ModalContext value={{ ref }}>
      {trigger}

      <dialog
        ref={ref}
        className="daisy-modal daisy-modal-bottom sm:daisy-modal-middle"
      >
        <div className="daisy-modal-box">{childrenWithoutTrigger}</div>
        <div
          className="daisy-modal-backdrop"
          onClick={() => ref.current?.close()}
        />
      </dialog>
    </ModalContext>
  );
}

Modal.Content = function ({ children }: PropsWithChildren) {
  return children;
};

Modal.Title = function ({ children }: PropsWithChildren) {
  return children;
};

Modal.Trigger = function <TElement extends keyof React.JSX.IntrinsicElements>({
  children,
  as,
  onClick,
  ...props
}: ComponentProps<TElement> & { as: TElement }) {
  const { ref } = useContext(ModalContext);

  const handleClick = (e: any) => (ref.current?.showModal(), onClick?.(e));
  return createElement(as, { ...props, onClick: handleClick }, children);
};

Modal.Close = function <TElement extends keyof React.JSX.IntrinsicElements>({
  children,
  as,
  onClick,
  ...props
}: ComponentProps<TElement> & { as: TElement }) {
  const { ref } = useContext(ModalContext);

  const handleClick = (e: any) => (ref.current?.close(), onClick?.(e));
  return createElement(as, { ...props, onClick: handleClick }, children);
};
