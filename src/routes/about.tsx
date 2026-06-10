import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Blue Ridge Grill" },
      { name: "description", content: "Casual American dining in Northern Virginia since 2002. Learn the Blue Ridge Grill story, our team, and what to expect when you visit." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section style={{ backgroundColor: "var(--brand-cream)" }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--brand-green)" }}>About Blue Ridge Grill</p>
            <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">Get Hooked</h1>
            <p className="mt-5 text-lg text-muted-foreground">
              After working for years at other restaurants in Northern Virginia, South America, and elsewhere in the world, Michael Norton & John Carroccio decided to create their own style of restaurant — one where the quality of food matched the finest restaurants, the portions exceeded expectations, the prices were reasonable, the service was excellent, the staff was outgoing, the atmosphere was relaxing, and the customers were, well, priceless.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
            <img
              src="https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-142.jpg"
              alt="Inside Blue Ridge Grill"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground">
            Blue Ridge Grill opened its first location in <strong>Leesburg in 2002</strong>. In <strong>2008</strong>, a second more modern BRG opened in the growing town of <strong>Brambleton</strong>, and in <strong>2016</strong> the newest location opened its doors in the conveniently located <strong>Ashburn Village shopping center</strong>.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Since the opening of the original restaurant, BRG is consistently voted Loudoun County's favorite casual dining establishment. So call ahead, or just stop by whether you're dining in or carrying out. Have a drink with Paul, Joe, or Carlos. Laugh with Rachel as she brings you your delicious meal, chat with the GMs, and meet all of the great employees and regulars who have become part of the BRG family.
          </p>
          <p className="mt-4 text-lg font-semibold" style={{ color: "var(--brand-blue)" }}>
            We're hooked. You will be too.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: "var(--brand-cream)" }}>
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold">The Team</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <TeamCard title="Proprietors" people={["John Carroccio", "Michael Norton"]} />
            <TeamCard title="General Managers" people={["Kevin Weitz", "Randy Corbin", "Matt Godden", "Paul San Jose"]} />
            <TeamCard title="Chefs" people={["Oscar Montecinos", "Wilder Barrientos", "Miguel Cabrejos"]} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold">What to Expect</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card title="Dress Code">Casual. Come as you are.</Card>
          <Card title="Price Range">Lunch $8–$15 · Dinner $12–$22</Card>
          <Card title="Call Ahead Seating">
            We do not offer reservations, but we do offer call ahead seating. Please call us up to an hour before arriving — we'll be happy to estimate your wait time and add you to our waiting list. This will reduce your wait in our restaurant.
          </Card>
          <Card title="General Bar Information">
            Our bar offers the full lunch and dinner menus. In addition, Sun–Thurs from 4pm 'til close, the bar offers reduced prices on select menu items. Holidays and special occasions are excluded. Non-smoking.
          </Card>
          <Card title="Gift Cards">
            Gift cards are available in any denomination. Visit our Gift Cards page, or either of our restaurants to purchase.
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
      <h3 className="font-display text-xl font-semibold" style={{ color: "var(--brand-blue)" }}>{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function TeamCard({ title, people }: { title: string; people: string[] }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-display text-lg font-semibold" style={{ color: "var(--brand-blue)" }}>{title}</h3>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {people.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </div>
  );
}
