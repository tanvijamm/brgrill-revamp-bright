import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LOCATIONS, type Location } from "@/lib/locations";

export const Route = createFileRoute("/locations/$slug")({
  loader: ({ params }): Location => {
    const loc = LOCATIONS[params.slug];
    if (!loc) throw notFound();
    return loc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Location"} — Blue Ridge Grill` },
      { name: "description", content: `Blue Ridge Grill ${loaderData?.name}: menus, hours, promotions, and directions. ${loaderData?.address ?? ""}` },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Location not found</h1>
      <Link to="/locations" className="mt-4 inline-block font-semibold underline" style={{ color: "var(--brand-blue)" }}>See all locations</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Try again</button>
    </div>
  ),
  component: LocationPage,
});

function LocationPage() {
  const loc = Route.useLoaderData() as Location;

  // Build the full menu list: standard menus + wine/spirits + bar happy hour + catering note
  const allTabs = [
    ...loc.menus.filter((m) => m.pdf),
    { id: "wine", label: "Wine & Spirits", pdf: loc.wineSpiritsPdf },
    { id: "happyhour", label: "Bar Happy Hour", pdf: loc.barHHPdf },
    ...loc.menus.filter((m) => !m.pdf),
  ];

  const [tab, setTab] = useState(allTabs[0].id);
  const active = allTabs.find((m) => m.id === tab) ?? allTabs[0];

  return (
    <>
      {/* Hero band */}
      <section style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-green))" }} className="text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest opacity-90">Blue Ridge Grill</p>
              <h1 className="mt-1 font-display text-5xl font-bold md:text-6xl">{loc.name}</h1>
              <p className="mt-3 max-w-xl opacity-90">{loc.address}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={loc.phoneHref} className="rounded-md bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25">Call {loc.phone}</a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`} target="_blank" rel="noreferrer" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/90">Directions</a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Quick facts */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <Fact title="Hours">
            <ul className="space-y-1 text-sm">
              {loc.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-3"><span className="font-medium">{h.day}</span><span className="text-muted-foreground">{h.time}</span></li>
              ))}
            </ul>
          </Fact>
          <Fact title="Brunch">{loc.brunch}</Fact>
          <Fact title="Promotion">{loc.wineNight}</Fact>
        </div>

        {/* Menus */}
        <div>
          <h2 className="font-display text-3xl font-bold">Menus</h2>
          <p className="mt-1 text-muted-foreground">Pulled directly from our printed menus. Scroll to browse, or open the PDF in a new tab.</p>

          <div className="mt-6 flex flex-wrap gap-2 border-b">
            {allTabs.map((m) => {
              const isActive = m.id === tab;
              return (
                <button key={m.id} onClick={() => setTab(m.id)}
                  className="relative -mb-px rounded-t-md px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
                  style={{
                    color: isActive ? "var(--brand-blue)" : "var(--color-muted-foreground)",
                    borderBottom: isActive ? "3px solid var(--brand-green)" : "3px solid transparent",
                  }}>
                  {m.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            {active.pdf ? (
              <MenuViewer
                key={active.pdf}
                pdf={active.pdf}
                gfPdf={"gfPdf" in active ? (active as { gfPdf?: string }).gfPdf : undefined}
                label={active.label}
                location={loc.name}
              />
            ) : (
              <div className="rounded-xl border bg-card p-8 text-center">
                <h3 className="font-display text-xl font-semibold">{active.label}</h3>
                <p className="mt-2 text-muted-foreground">{"note" in active ? active.note : ""}</p>
                <a href={loc.phoneHref} className="mt-4 inline-block rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "var(--brand-blue)" }}>Call {loc.phone}</a>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="mt-14">
          <h2 className="font-display text-3xl font-bold">Find Us</h2>
          <div className="mt-4 overflow-hidden rounded-xl border">
            <iframe
              title={`${loc.name} map`}
              className="h-[400px] w-full"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(loc.mapQuery)}&output=embed`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function MenuViewer({ pdf, gfPdf, label, location }: { pdf: string; gfPdf?: string; label: string; location: string }) {
  const [useNative, setUseNative] = useState(false);
  const googleSrc = (url: string) =>
    `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
  const src = useNative ? `${pdf}#view=FitH&toolbar=1` : googleSrc(pdf);

  // Use Google's viewer for "open in new tab" — direct hotlinking to brgrill.com
  // PDFs can be blocked by some browsers / popup heuristics. The Google viewer
  // page is a normal HTML page and opens reliably.
  const openInNewTab = (url: string) => googleSrc(url);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 pb-3 text-sm">
        <a
          href={openInNewTab(pdf)}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-md px-3 py-1.5 font-semibold text-white"
          style={{ backgroundColor: "var(--brand-blue)" }}
        >
          Open {label} PDF ↗
        </a>
        {gfPdf && (
          <a
            href={openInNewTab(gfPdf)}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border-2 px-3 py-1.5 font-semibold"
            style={{ borderColor: "var(--brand-green)", color: "var(--brand-dark)" }}
          >
            Gluten-Free {label} ↗
          </a>
        )}
        <button
          type="button"
          onClick={() => setUseNative((v) => !v)}
          className="ml-auto rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-accent"
        >
          {useNative ? "Use Google viewer (recommended)" : "Try native PDF viewer"}
        </button>
      </div>
      <div
        className="overflow-auto rounded-xl border bg-muted"
        style={{ height: "min(85vh, 1200px)" }}
      >
        <iframe
          key={src}
          src={src}
          title={`${location} ${label} menu`}
          className="block h-full w-full border-0"
          loading="lazy"
        />
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Menu PDF served from brgrill.com via Google Docs Viewer. If it doesn't load,{" "}
        <a href={openInNewTab(pdf)} target="_blank" rel="noreferrer noopener" className="font-semibold underline" style={{ color: "var(--brand-blue)" }}>open it in a new tab</a>.
      </p>
    </div>
  );
}

function Fact({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-display text-lg font-semibold" style={{ color: "var(--brand-blue)" }}>{title}</h3>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

