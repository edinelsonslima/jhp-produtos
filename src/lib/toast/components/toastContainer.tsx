import { useEffect, useState } from "react";
import { toastEventManager } from "../helpers/toast";

import { generateUUID } from "@/lib/utils";
import { createPortal } from "react-dom";
import { IToast, IToastContainerProps, IToastData } from "../@types";

export function ToastContainer({
  defaultDuration,
  children,
  ...props
}: IToastContainerProps) {
  const [messages, setMessages] = useState<IToastData[]>([]);

  const handleRemoveToastMessage = (id: IToastData["id"]) => {
    setMessages((prevMessages) => {
      return prevMessages.filter((message) => message.id !== id);
    });
  };

  useEffect(() => {
    function handleAddToast(data: IToast) {
      const { content, type, duration = defaultDuration } = data;

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: generateUUID(), content, duration, type },
      ]);
    }

    toastEventManager.on("add-toast", handleAddToast);

    return () => {
      toastEventManager.removeListener("add-toast", handleAddToast);
    };
  }, [defaultDuration]);

  return createPortal(
    <div {...props}>
      {messages.map((message) =>
        children({ ...message, remove: handleRemoveToastMessage }),
      )}
    </div>,
    document.body,
  );
}
