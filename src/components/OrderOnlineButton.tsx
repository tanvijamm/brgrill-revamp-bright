import { useState, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export const CHOWNOW_URL =
  "https://order.chownow.com/order/18342/locations?add_cn_ordering_class=true";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Force modal regardless of route (e.g. for embedded hero CTA). */
  forceModal?: boolean;
};

export function OrderOnlineButton({ className, style, children, forceModal }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";
  const useModal = forceModal ?? isHome;

  if (useModal) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={className}
          style={style}
        >
          {children ?? "Order Online"}
        </button>
        {open && <OrderOnlineModal onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <a
      href={CHOWNOW_URL}
      target="_blank"
      rel="noreferrer"
      className={className}
      style={style}
    >
      {children ?? "Order Online"}
    </a>
  );
}

function OrderOnlineModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 md:p-10 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Order Online"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 text-white"
          style={{ backgroundColor: "var(--brand-dark, #0b1320)" }}
        >
          <div className="font-display text-base font-semibold sm:text-lg">
            Order Online — Blue Ridge Grill
          </div>
          <div className="flex items-center gap-2">
            <a
              href={CHOWNOW_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/30 hover:bg-white/10"
            >
              Open in new tab ↗
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-2 text-white/90 hover:bg-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="relative flex-1 bg-white">
          <iframe
            src={CHOWNOW_URL}
            title="Order Online via ChowNow"
            className="absolute inset-0 h-full w-full border-0"
            allow="payment; geolocation"
          />
        </div>
      </div>
    </div>
  );
}
