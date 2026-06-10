import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouterState } from "@tanstack/react-router";

export const CHOWNOW_URL =
  "https://order.chownow.com/order/18342/locations?add_cn_ordering_class=true";

const MOBILE_BREAKPOINT = 768;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Force modal on desktop regardless of route (e.g. hero CTA on home). */
  forceModal?: boolean;
};

export function OrderOnlineButton({ className, style, children, forceModal }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isHome = pathname === "/";
  const preferModal = forceModal ?? isHome;

  const handleClick = () => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (isMobile || !preferModal) {
      window.open(CHOWNOW_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className} style={style}>
        {children ?? "Order Online"}
      </button>
      {mounted && open && createPortal(<OrderOnlineModal onClose={() => setOpen(false)} />, document.body)}
    </>
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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label="Order Online"
      onClick={onClose}
    >
      <div
        className="relative flex h-[min(92vh,820px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 text-white"
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
              className="flex h-11 w-11 items-center justify-center rounded-md text-white/90 hover:bg-white/10"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="relative min-h-0 flex-1 bg-white">
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
