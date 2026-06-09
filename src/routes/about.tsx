import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Blue Ridge Grill" },
      { name: "description", content: "Casual American dining in Northern Virginia. Learn about Blue Ridge Grill, our philosophy, and what to expect when you visit." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section style={{ backgroundColor: "var(--brand-cream)" }}>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--brand-green)" }}>About</p>
          <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">Get Hooked</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Blue Ridge Grill is Northern Virginia's answer to affordable and great-tasting family dining. Come in and enjoy a casual lunch or dinner in a warm, understated, elegant atmosphere.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Dress Code">Casual. Come as you are.</Card>
          <Card title="Price Range">Lunch $8–$15 · Dinner $12–$22</Card>
          <Card title="Call Ahead Seating">
            We do not offer reservations, but we do offer call ahead seating. Please call us up to an hour before arriving — we'll be happy to estimate your wait and add you to our list.
          </Card>
          <Card title="General Bar Information">
            Our bar offers the full lunch and dinner menus. In addition, Sun–Thurs from 4pm 'til close, the bar offers reduced prices on select menu items. Holidays and special occasions excluded. Non-smoking.
          </Card>
          <Card title="Methods of Payment">
            Cash, Visa, MasterCard, Discover, American Express, Travelers Checks and Diner's Club. We do not accept personal checks.
          </Card>
          <Card title="To-Go Orders">
            To-go orders can be placed over the phone or in person 7 days a week. Please visit our bar to pick up to-go orders.
          </Card>
        </div>
      </section>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-display text-xl font-semibold" style={{ color: "var(--brand-blue)" }}>{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
