import { createFileRoute, Link } from "@tanstack/react-router";
import { LOCATION_LIST } from "@/lib/locations";

export const Route = createFileRoute("/locations/")({
  head: () => ({
    meta: [
      { title: "Locations — Blue Ridge Grill" },
      { name: "description", content: "Find your nearest Blue Ridge Grill in Ashburn, Brambleton, or Leesburg, Virginia." },
    ],
  }),
  component: LocationsIndex,
});

function LocationsIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold md:text-5xl">Our Locations</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Each Blue Ridge Grill offers the same menu you love, with local touches and weekly promotions.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {LOCATION_LIST.map((loc) => (
          <Link key={loc.slug} to="/locations/$slug" params={{ slug: loc.slug }} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="flex aspect-[4/3] flex-col items-center justify-center text-white" style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-green))" }}>
              <div className="font-display text-3xl font-bold">{loc.name}</div>
              <div className="mt-1 text-sm opacity-90">{loc.phone}</div>
            </div>
            <div className="p-5">
              <div className="text-sm text-muted-foreground">{loc.address}</div>
              <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: "var(--brand-blue)" }}>View menus & details →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
