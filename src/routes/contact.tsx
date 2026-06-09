import { createFileRoute } from "@tanstack/react-router";
import { LOCATION_LIST } from "@/lib/locations";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Blue Ridge Grill" },
      { name: "description", content: "Get in touch with Blue Ridge Grill. Phone numbers, addresses, and directions for our Ashburn, Brambleton, and Leesburg locations." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold md:text-5xl">Contact Us</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Call ahead, get directions, or stop by any of our three locations.</p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {LOCATION_LIST.map((loc) => (
          <div key={loc.slug} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="px-6 py-5 text-white" style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-green))" }}>
              <h2 className="font-display text-2xl font-bold">{loc.name}</h2>
            </div>
            <div className="space-y-4 p-6 text-sm">
              <div>
                <div className="font-semibold">Address</div>
                <div className="text-muted-foreground">{loc.address}</div>
              </div>
              <div>
                <div className="font-semibold">Phone</div>
                <a href={loc.phoneHref} className="font-semibold" style={{ color: "var(--brand-blue)" }}>{loc.phone}</a>
              </div>
              <div>
                <div className="font-semibold">Hours</div>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">
                  {loc.hours.map((h) => <li key={h.day}>{h.day}: {h.time}</li>)}
                </ul>
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`} target="_blank" rel="noreferrer" className="inline-block rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "var(--brand-blue)" }}>Get Directions</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
