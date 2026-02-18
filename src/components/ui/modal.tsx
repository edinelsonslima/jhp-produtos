import { cn } from "@/lib/utils";
import {
  Children,
  ComponentProps,
  createContext,
  createElement,
  ElementType,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useContext,
  useRef,
} from "react";
import { createPortal } from "react-dom";

interface ModalContextValue {
  ref: RefObject<HTMLDialogElement | null>;
}

const ModalContext = createContext<ModalContextValue>({
  ref: { current: null },
});

export function Modal({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDialogElement>(null);
  const childrenArray = Children.toArray(children);

  const isElement = (child: ReactNode, Component: unknown) =>
    isValidElement(child) && child.type === Component;

  const trigger = childrenArray.find((child) =>
    isElement(child, Modal.Trigger),
  );

  const childrenWithoutTrigger = childrenArray.filter(
    (child) => !isElement(child, Modal.Trigger),
  );

  return (
    <ModalContext value={{ ref }}>
      {trigger}
      {createPortal(
        <dialog
          ref={ref}
          className="daisy-modal daisy-modal-bottom sm:daisy-modal-middle"
        >
          <div className="daisy-modal-box max-h-dvh">
            {childrenWithoutTrigger}
          </div>

          <div
            className="daisy-modal-backdrop"
            onClick={() => ref?.current?.close()}
          />
        </dialog>,
        document.body,
      )}
    </ModalContext>
  );
}

Modal.Content = function Content<
  TElement extends keyof React.JSX.IntrinsicElements,
>({ as, children, ...props }: ComponentProps<TElement> & { as?: TElement }) {
  return as ? createElement(as, props, children) : children;
};

Modal.Title = function Title({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentProps<"div">>) {
  return (
    <div className={cn("flex items-center gap-3 mb-6", className)} {...props}>
      {children}
    </div>
  );
};

Modal.Actions = function Actions({
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  children: ({ close }: { close: () => void }) => ReactNode;
}) {
  const { ref } = useContext(ModalContext);

  return (
    <div className={cn("daisy-modal-action", className)} {...props}>
      {children({ close: () => ref.current?.close() })}
    </div>
  );
};

Modal.Trigger = function Trigger<
  TElement extends keyof React.JSX.IntrinsicElements | ElementType,
>({
  children,
  as,
  onClick,
  ...props
}: ComponentProps<TElement> & { as: TElement }) {
  const { ref } = useContext(ModalContext);

  const handleClick = (e: unknown) => (ref.current?.showModal(), onClick?.(e));
  return createElement(as, { ...props, onClick: handleClick }, children);
};
