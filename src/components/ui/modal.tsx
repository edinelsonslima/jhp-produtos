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
  useState,
} from "react";
import { createPortal } from "react-dom";

function ModalDraggableBox({
  children,
  dialogRef,
}: PropsWithChildren<{ dialogRef: RefObject<HTMLDialogElement | null> }>) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isScrollable = target.closest("[data-modal-scroll]");
    if (isScrollable) return;

    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      currentY.current = delta;
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (currentY.current > 100) {
      dialogRef.current?.close();
    }

    setDragY(0);
    currentY.current = 0;
  };

  return (
    <div
      className="daisy-modal-box max-h-dvh"
      style={{
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? "none" : "transform 0.2s ease-out",
        opacity: isDragging ? Math.max(0.5, 1 - dragY / 300) : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-10 h-1 rounded-full bg-base-content/20 mx-auto mb-3 sm:hidden" />
      {children}
    </div>
  );
}

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
          <ModalDraggableBox dialogRef={ref}>
            {childrenWithoutTrigger}
          </ModalDraggableBox>

          <div
            role="button"
            tabIndex={-1}
            aria-label="Fechar"
            className="daisy-modal-backdrop"
            onClick={() => ref?.current?.close()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") ref?.current?.close();
            }}
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
