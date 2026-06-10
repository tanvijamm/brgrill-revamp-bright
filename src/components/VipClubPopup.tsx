import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { LOCATION_LIST } from "@/lib/locations";
import { submitVipSignup } from "@/lib/api/forms.functions";

const DISMISS_KEY = "brg-vip-dismissed";
const AUTO_OPEN_DELAY_MS = 18_000;

type VipClubContextValue = {
  open: () => void;
  close: () => void;
};

const VipClubContext = createContext<VipClubContextValue | null>(null);

export function useVipClub() {
  const ctx = useContext(VipClubContext);
  if (!ctx) throw new Error("useVipClub must be used within VipClubProvider");
  return ctx;
}

export function VipClubProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback((permanent = false) => {
    setOpen(false);
    if (permanent) {
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <VipClubContext.Provider value={{ open: openModal, close: () => closeModal(false) }}>
      {children}
      {open && <VipClubModal onClose={closeModal} />}
    </VipClubContext.Provider>
  );
}

function VipClubModal({ onClose }: { onClose: (permanent?: boolean) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(dontShowAgain);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, dontShowAgain]);

  const handleClose = () => onClose(dontShowAgain);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitVipSignup({
        data: { email: email.trim(), phone: phone.trim() || undefined, location: location || undefined },
      });
      setSubmitted(true);
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
    } catch {
      setError("Something went wrong. Please try again or sign up in person at any location.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="BRG VIP Club"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative px-6 py-5 pr-16 text-white"
          style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-green))" }}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-lg text-white hover:bg-white/15 active:bg-white/25"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-90">BRG VIP Club</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Join & get hooked</h2>
          <p className="mt-2 text-sm opacity-90">
            Free appetizer when you sign up — plus birthday dessert, exclusive specials, and early
            access to events.
          </p>
        </div>

        <div className="px-6 py-5">
          {submitted ? (
            <div className="text-center">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                style={{ backgroundColor: "color-mix(in oklab, var(--brand-green) 25%, white)" }}
              >
                ✓
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">You're in!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Welcome to the BRG VIP Club. We'll send your welcome offer to{" "}
                <strong>{email}</strong> shortly. Show this confirmation on your next visit for a
                free appetizer.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 w-full rounded-md py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--brand-blue)" }}
              >
                Sounds great
              </button>
            </div>
          ) : (
            <>
              <ul className="mb-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span style={{ color: "var(--brand-green)" }}>✓</span> Free dessert on your birthday
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--brand-green)" }}>✓</span> Free appetizer after joining
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--brand-green)" }}>✓</span> Exclusive specials & early event access
                </li>
              </ul>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold">
                    Email<span className="ml-0.5 text-red-600">*</span>
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="vip-input mt-1"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Phone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="vip-input mt-1"
                    placeholder="(000) 000-0000"
                    autoComplete="tel"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Favorite location</span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="vip-input mt-1"
                  >
                    <option value="">Select a location</option>
                    {LOCATION_LIST.map((loc) => (
                      <option key={loc.slug} value={loc.slug}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md py-3 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "var(--brand-green)", color: "var(--brand-dark)" }}
                >
                  {submitting ? "Joining…" : "Join the VIP Club"}
                </button>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="accent-[var(--brand-blue)]"
                  />
                  Don't show this again
                </label>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        .vip-input {
          width: 100%;
          border: 2px solid var(--color-border);
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
        }
        .vip-input:focus { border-color: var(--brand-blue); }
      `}</style>
    </div>,
    document.body,
  );
}

/** Nav/footer trigger — opens VIP modal without adding a route. */
export function VipClubButton({
  className,
  style,
  children,
  onClick,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const { open } = useVipClub();
  return (
    <button
      type="button"
      onClick={() => {
        open();
        onClick?.();
      }}
      className={className}
      style={style}
    >
      {children ?? "VIP Club"}
    </button>
  );
}
