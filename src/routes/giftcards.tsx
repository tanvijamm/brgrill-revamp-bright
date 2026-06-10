import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/giftcards")({
  head: () => ({
    meta: [
      { title: "Gift Cards — Blue Ridge Grill" },
      { name: "description", content: "Purchase Blue Ridge Grill gift cards in $25, $50, $75, $100, $150, or $200 denominations. Shipped within 2 business days." },
    ],
  }),
  component: GiftCards,
});

const DENOMS = [25, 50, 75, 100, 150, 200];
type QtyMap = Record<number, number>;

function GiftCards() {
  const [qty, setQty] = useState<QtyMap>({});
  const [submitted, setSubmitted] = useState(false);

  const items = DENOMS.filter((d) => (qty[d] ?? 0) > 0);
  const subtotal = items.reduce((sum, d) => sum + d * (qty[d] ?? 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--brand-green)" }}>Gift Cards</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Purchase BRG Gift Cards</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Please choose your gift cards below. We'll process your gift card order within 2 business days of receipt, and will notify you upon shipment. Available in $25, $50, $75, $100, $150 and $200 denominations. If you need a different denomination, please contact one of our locations.
        </p>
      </header>

      {submitted ? (
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border-2 p-8 text-center" style={{ borderColor: "var(--brand-green)", backgroundColor: "color-mix(in oklab, var(--brand-green) 12%, white)" }}>
          <h2 className="font-display text-2xl font-bold">Thanks — your gift card request was received.</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Online payment processing is coming soon. We've saved your order ({items.map((d) => `${qty[d]} × $${d}`).join(", ")} — total <strong>${subtotal}</strong>) as a placeholder and will reach out shortly to complete it. In the meantime, gift cards can also be purchased at any of our restaurants.
          </p>
          <button onClick={() => { setQty({}); setSubmitted(false); }} className="mt-6 rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "var(--brand-blue)" }}>Place another order</button>
        </div>
      ) : (
        <form
          className="mt-10 grid gap-8 md:grid-cols-[1fr_22rem]"
          onSubmit={(e) => { e.preventDefault(); if (subtotal > 0) setSubmitted(true); }}
        >
          {/* Left: form */}
          <div className="space-y-8">
            <Section title="Choose your gift cards">
              <div className="grid gap-3 sm:grid-cols-2">
                {DENOMS.map((d) => (
                  <DenomRow
                    key={d}
                    amount={d}
                    quantity={qty[d] ?? 0}
                    onChange={(q) => setQty((prev) => ({ ...prev, [d]: q }))}
                  />
                ))}
              </div>
            </Section>

            <Section title="Your information">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name" required><input required type="text" className="input" autoComplete="name" /></Field>
                <Field label="Your email" required><input required type="email" className="input" autoComplete="email" /></Field>
                <Field label="Phone number" hint="Format: (000) 000-0000">
                  <input type="tel" className="input" placeholder="(000) 000-0000" autoComplete="tel" />
                </Field>
              </div>
            </Section>

            <Section title="Shipping address">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Recipient name" required><input required type="text" className="input" /></Field>
                <Field label="Street address" required className="sm:col-span-2"><input required type="text" className="input" autoComplete="street-address" /></Field>
                <Field label="Address line 2"><input type="text" className="input" placeholder="Apt, suite, etc. (optional)" /></Field>
                <Field label="City" required><input required type="text" className="input" autoComplete="address-level2" /></Field>
                <Field label="State" required><input required type="text" className="input" maxLength={2} placeholder="VA" autoComplete="address-level1" /></Field>
                <Field label="ZIP code" required><input required type="text" className="input" inputMode="numeric" autoComplete="postal-code" /></Field>
              </div>
            </Section>

            <Section title="Personal message" hint="Optional — printed on the card holder">
              <textarea rows={3} className="input resize-none" placeholder="Happy birthday!" />
            </Section>

            <Section title="Payment" hint="Accepted: Visa · MasterCard · Discover · American Express">
              <div className="rounded-md border-2 border-dashed bg-muted/40 p-4 text-xs text-muted-foreground">
                <strong className="text-foreground">Payment processing coming soon.</strong> Fields below are a placeholder — no card information will be charged or stored. We'll wire this up to a secure payment processor in a follow-up.
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Name on card" required className="sm:col-span-2"><input required type="text" className="input" disabled placeholder="Coming soon" autoComplete="cc-name" /></Field>
                <Field label="Card number" required className="sm:col-span-2"><input required type="text" className="input" disabled placeholder="•••• •••• •••• ••••" autoComplete="cc-number" /></Field>
                <Field label="Expiration (MM/YY)" required><input required type="text" className="input" disabled placeholder="MM/YY" autoComplete="cc-exp" /></Field>
                <Field label="CVC" required><input required type="text" className="input" disabled placeholder="•••" autoComplete="cc-csc" /></Field>
                <Field label="Billing ZIP" required><input required type="text" className="input" disabled placeholder="ZIP" /></Field>
              </div>
            </Section>
          </div>

          {/* Right: order summary (sticky) */}
          <aside className="md:sticky md:top-24 md:self-start">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-display text-lg font-semibold" style={{ color: "var(--brand-blue)" }}>Order summary</h3>
              {items.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No gift cards selected yet.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {items.map((d) => (
                    <li key={d} className="flex justify-between">
                      <span>{qty[d]} × ${d} card</span>
                      <span className="font-semibold">${d * (qty[d] ?? 0)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-sm font-semibold">Subtotal</span>
                <span className="font-display text-xl font-bold">${subtotal}</span>
              </div>
              <button
                type="submit"
                disabled={subtotal === 0}
                className="mt-5 w-full rounded-md py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--brand-blue)" }}
              >
                Place gift card order
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Placeholder — payment is not yet processed. We'll follow up to complete the order.
              </p>
            </div>
            <div className="mt-4 rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground">
              Orders are processed and shipped within 2 business days. You'll receive an email when your card ships.
            </div>
          </aside>
        </form>
      )}

      <style>{`
        .input {
          width: 100%;
          border: 2px solid var(--color-border);
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
          transition: border-color .15s;
        }
        .input:focus { border-color: var(--brand-blue); }
        .input:disabled { background: #f6f6f6; color: #888; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--brand-blue)" }}>{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, required, children, className }: { label: string; hint?: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-sm font-semibold">
        {label}{required && <span className="ml-0.5 text-red-600">*</span>}
      </span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

function DenomRow({ amount, quantity, onChange }: { amount: number; quantity: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-md border-2 p-3" style={{ borderColor: quantity > 0 ? "var(--brand-blue)" : "var(--color-border)" }}>
      <div>
        <div className="font-display text-lg font-bold">${amount}</div>
        <div className="text-xs text-muted-foreground">Gift card</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Qty</span>
        <select
          value={quantity}
          onChange={(e) => onChange(Number(e.target.value))}
          className="rounded-md border-2 bg-white px-2 py-1 text-sm font-semibold outline-none"
        >
          {Array.from({ length: 11 }).map((_, i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
