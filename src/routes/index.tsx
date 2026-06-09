import { createFileRoute, Link } from "@tanstack/react-router";
import { LOCATION_LIST } from "@/lib/locations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blue Ridge Grill — Ashburn · Brambleton · Leesburg" },
      { name: "description", content: "Northern Virginia's casual American grill. Three convenient locations serving lunch, dinner, brunch, and a full bar." },
      { property: "og:title", content: "Blue Ridge Grill" },
      { property: "og:description", content: "Three convenient locations. Casual American dining." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "var(--brand-cream)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--brand-green)" }}>Northern Virginia · Since 2002</p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Casual American dining,<br/>
              <span style={{ color: "var(--brand-blue)" }}>done right.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Affordable, great-tasting family dining in a warm, understated atmosphere. Three convenient locations across Loudoun County.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/locations" className="rounded-md px-5 py-3 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--brand-blue)", color: "white" }}>View Menus & Locations</Link>
              <a href="https://order.toasttab.com/online/blue-ridge-grill" target="_blank" rel="noreferrer" className="rounded-md border-2 px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent" style={{ borderColor: "var(--brand-green)", color: "var(--brand-dark)" }}>Order Online</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
              <img src="https://brgrill.com/wp-content/uploads/2015/07/fisherman.jpg" alt="Fisherman at sunrise" className="h-full w-full object-cover" loading="eager"/>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl px-5 py-4 shadow-xl md:block" style={{ backgroundColor: "var(--brand-green)" }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-dark)" }}>Get Hooked</div>
              <div className="font-display text-lg font-bold" style={{ color: "var(--brand-dark)" }}>Fresh. Local. Casual.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Three Convenient Locations</h2>
            <p className="mt-2 text-muted-foreground">Menus, features, promos, hours & directions.</p>
          </div>
          <Link to="/locations" className="hidden text-sm font-semibold hover:underline md:inline" style={{ color: "var(--brand-blue)" }}>See all →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {LOCATION_LIST.map((loc) => (
            <Link key={loc.slug} to="/locations/$slug" params={{ slug: loc.slug }} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden" style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-green))" }}>
                <div className="flex h-full flex-col items-center justify-center text-white">
                  <div className="font-display text-3xl font-bold tracking-tight">{loc.name}</div>
                  <div className="mt-1 text-sm opacity-90">{loc.phone}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-sm text-muted-foreground">{loc.address}</div>
                <div className="mt-3 text-sm font-semibold transition-colors group-hover:underline" style={{ color: "var(--brand-blue)" }}>
                  Menus, features, promos, hours & directions →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Get Hooked / Info */}
      <section style={{ backgroundColor: "var(--brand-cream)" }}>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Get Hooked</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Blue Ridge Grill is Northern Virginia's answer to affordable, great-tasting family dining. Come in and enjoy a casual lunch or dinner in a warm, understated, elegant atmosphere.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
              <div><dt className="font-semibold">Dress Code</dt><dd className="text-muted-foreground">Casual</dd></div>
              <div><dt className="font-semibold">Price Range</dt><dd className="text-muted-foreground">Lunch $8–15 · Dinner $12–22</dd></div>
              <div><dt className="font-semibold">Payment</dt><dd className="text-muted-foreground">Cash, Visa, MC, Discover, AmEx</dd></div>
              <div><dt className="font-semibold">To-Go</dt><dd className="text-muted-foreground">Phone or in-person, 7 days/week</dd></div>
            </dl>
          </div>
          <div className="grid gap-4">
            <InfoCard title="Call Ahead Seating">
              We don't take reservations, but we'll happily estimate your wait and add you to our list. Call up to an hour before arriving.
            </InfoCard>
            <InfoCard title="At the Bar">
              Our bar offers the full lunch and dinner menus. Sun–Thurs from 4pm 'til close, enjoy reduced prices on select items. Non-smoking.
            </InfoCard>
            <InfoCard title="Gift Cards">
              Available in any denomination. <Link to="/giftcards" className="font-semibold underline" style={{ color: "var(--brand-blue)" }}>Purchase online</Link> or in any of our restaurants.
            </InfoCard>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-display text-lg font-semibold" style={{ color: "var(--brand-blue)" }}>{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
