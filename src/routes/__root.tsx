import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { OrderOnlineButton } from "../components/OrderOnlineButton";
import { VipClubButton, VipClubProvider } from "../components/VipClubPopup";
import { BRG_LOGO_SRC } from "../lib/brg-logo";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Try again</button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Blue Ridge Grill — Casual American Dining in Northern Virginia" },
      { name: "description", content: "Blue Ridge Grill — three convenient Northern Virginia locations in Ashburn, Brambleton, and Leesburg. Affordable, great-tasting family dining." },
      { property: "og:title", content: "Blue Ridge Grill" },
      { property: "og:description", content: "Casual American dining in Ashburn, Brambleton & Leesburg." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/locations", label: "Locations" },
  { to: "/contact", label: "Contact" },
  { to: "/giftcards", label: "Gift Cards" },
] as const;

const ABOUT_LINKS = [
  { to: "/about", label: "Our Story" },
  { to: "/employment", label: "Join Our Team" },
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aboutOpen) return;
    const onClick = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [aboutOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)} aria-label="Blue Ridge Grill — Home">
          <img
            src={BRG_LOGO_SRC}
            alt="Blue Ridge Grill"
            className="h-10 w-auto sm:h-12 md:h-14"
            loading="eager"
          />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.slice(0, 2).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold text-primary bg-accent" }}
              activeOptions={{ exact: "exact" in n && n.exact }}
            >
              {n.label}
            </Link>
          ))}
          <div className="relative" ref={aboutRef}>
            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              aria-expanded={aboutOpen}
              aria-haspopup="true"
            >
              About
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${aboutOpen ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {aboutOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 min-w-[11rem] rounded-md border border-border bg-background py-1 shadow-lg">
                {ABOUT_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setAboutOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
                    activeProps={{ className: "block px-4 py-2 text-sm font-semibold bg-accent text-primary" }}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="/#reviews"
                  onClick={() => setAboutOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
                >
                  Reviews
                </a>
              </div>
            )}
          </div>
          {NAV_LINKS.slice(2).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold text-primary bg-accent" }}
              activeOptions={{ exact: "exact" in n && n.exact }}
            >
              {n.label}
            </Link>
          ))}
          <VipClubButton
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
          />
          <OrderOnlineButton
            className="ml-1 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "var(--brand-green)", color: "var(--brand-dark)" }}
          />
        </nav>
        <button onClick={() => setOpen(!open)} className="rounded-md p-2 md:hidden" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6"/> : <path d="M3 6h18M3 12h18M3 18h18"/>}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link to="/" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-semibold bg-accent text-primary" }} activeOptions={{ exact: true }}>
              Home
            </Link>
            <Link to="/locations" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-semibold bg-accent text-primary" }}>
              Locations
            </Link>
            <div className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">About</div>
            {ABOUT_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-semibold bg-accent text-primary" }}>
                {link.label}
              </Link>
            ))}
            <a href="/#reviews" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
              Reviews
            </a>
            <Link to="/contact" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-semibold bg-accent text-primary" }}>
              Contact
            </Link>
            <Link to="/giftcards" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-semibold bg-accent text-primary" }}>
              Gift Cards
            </Link>
            <VipClubButton onClick={() => setOpen(false)} className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent cursor-pointer" />
            <OrderOnlineButton className="mt-2 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold cursor-pointer" style={{ backgroundColor: "var(--brand-green)", color: "var(--brand-dark)" }} />
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border" style={{ backgroundColor: "var(--brand-dark)", color: "var(--brand-cream)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="font-display text-xl font-bold">Blue Ridge Grill</div>
          <p className="mt-3 text-sm opacity-80">Casual American dining in Northern Virginia since 2002.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider opacity-70">Locations</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/locations/$slug" params={{ slug: "ashburn" }} className="hover:underline">Ashburn — 703.729.0100</Link></li>
            <li><Link to="/locations/$slug" params={{ slug: "brambleton" }} className="hover:underline">Brambleton — 703.327.1047</Link></li>
            <li><Link to="/locations/$slug" params={{ slug: "leesburg" }} className="hover:underline">Leesburg — 703.669.5505</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider opacity-70">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/employment" className="hover:underline">Employment</Link></li>
            <li><a href="/#reviews" className="hover:underline">Reviews</a></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/giftcards" className="hover:underline">Gift Cards</Link></li>
            <li><VipClubButton className="hover:underline cursor-pointer text-left" /></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider opacity-70">Call Ahead Seating</h4>
          <p className="mt-3 text-sm opacity-80">We do not take reservations but happily add you to our waitlist when you call up to an hour before arriving.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-60">© {new Date().getFullYear()} Blue Ridge Grill. All rights reserved.</div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <VipClubProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1"><Outlet /></main>
          <Footer />
        </div>
      </VipClubProvider>
    </QueryClientProvider>
  );
}
