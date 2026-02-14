import { cn } from "@/lib/utils";
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
  useEffect,
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

  let trigger: ReactNode;
  const childrenWithoutTrigger = Children.map(children, (child) => {
    if (isValidElement(child) && Modal.Trigger === child.type) {
      trigger = child;
      return null;
    }

    return child;
  });

  useEffect(() => {
    return () => {
      ref.current?.remove();
    };
  }, []);

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

Modal.Content = function <TElement extends keyof React.JSX.IntrinsicElements>({
  as,
  children,
  ...props
}: ComponentProps<TElement> & { as?: TElement }) {
  return as ? createElement(as, props, children) : children;
};

Modal.Title = function ({
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

Modal.Actions = function ({
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
