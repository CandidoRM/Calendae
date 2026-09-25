import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function FormSlot({ id, children }: { id: string | null; children: ReactNode }) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!id) {
      setNode(null);
      return;
    }
    setNode(document.getElementById(id));
  }, [id]);
  if (!id) return children;
  if (!node) return null;
  return createPortal(children, node);
}
