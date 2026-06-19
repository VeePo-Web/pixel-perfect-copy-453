import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  size?: "panel" | "modal";
};

/**
 * Lightweight focus-trapping modal/sheet. ESC closes, click outside closes,
 * focus restores to opener.
 */
export default function ModalShell({ open, onClose, labelledBy, children, size = "modal" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab" && containerRef.current) {
        const focusables = containerRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // initial focus
    window.setTimeout(() => {
      const first = containerRef.current?.querySelector<HTMLElement>(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 30);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const isPanel = size === "panel";
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-50 flex motion-safe:animate-section-in"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal-950/75 backdrop-blur-sm"
      />
      <div
        ref={containerRef}
        className={
          isPanel
            ? "relative ml-auto flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/[0.08] bg-charcoal-950 shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.6)]"
            : "relative m-auto flex max-h-[92dvh] w-[92vw] max-w-md flex-col overflow-y-auto rounded-2xl border border-white/[0.08] bg-charcoal-950 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
        }
      >
        {children}
      </div>
    </div>
  );
}
