import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/giftcards")({
  head: () => ({
    meta: [
      { title: "Gift Cards — Blue Ridge Grill" },
      { name: "description", content: "Purchase a Blue Ridge Grill gift card in any denomination. Perfect for any occasion." },
    ],
  }),
  component: GiftCards,
});

const PRESETS = [25, 50, 75, 100, 150, 200];

function GiftCards() {
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = custom ? Number(custom) || 0 : amount;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Card preview */}
        <div className="order-2 md:order-1">
          <div className="sticky top-24">
            <div className="relative aspect-[8/5] overflow-hidden rounded-2xl p-7 text-white shadow-2xl" style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-green))" }}>
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Blue Ridge Grill</div>
                  <div className="mt-1 font-display text-3xl font-bold">Gift Card</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Amount</div>
                  <div className="font-display text-5xl font-bold">${finalAmount || 0}</div>
                </div>
              </div>
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/10" />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">A digital gift card emailed straight to your recipient.</p>
          </div>
        </div>

        {/* Form */}
        <div className="order-1 md:order-2">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--brand-green)" }}>Gift Cards</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Give a meal worth coming back for.</h1>
          <p className="mt-4 text-muted-foreground">
            Available in any denomination. Online purchases are coming soon — submit your order below and we'll be in touch to complete it, or stop in to any location.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-xl border-2 p-6" style={{ borderColor: "var(--brand-green)", backgroundColor: "color-mix(in oklab, var(--brand-green) 12%, white)" }}>
              <h2 className="font-display text-xl font-semibold">Thanks! Your request was received.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This is a placeholder — payment processing will be enabled soon. We'll reach out to confirm your ${finalAmount} gift card.
              </p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-sm font-semibold underline" style={{ color: "var(--brand-blue)" }}>Submit another</button>
            </div>
          ) : (
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            >
              <div>
                <label className="text-sm font-semibold">Choose an amount</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {PRESETS.map((v) => (
                    <button type="button" key={v} onClick={() => { setAmount(v); setCustom(""); }}
                      className="rounded-md border-2 px-3 py-2 text-sm font-semibold transition-colors"
                      style={{
                        borderColor: !custom && amount === v ? "var(--brand-blue)" : "var(--color-border)",
                        backgroundColor: !custom && amount === v ? "color-mix(in oklab, var(--brand-blue) 10%, white)" : "white",
                      }}>
                      ${v}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="text-xs text-muted-foreground">Or enter a custom amount</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input type="number" min="10" max="500" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="0" className="w-full rounded-md border-2 py-2 pl-7 pr-3 text-sm outline-none focus:border-[var(--brand-blue)]" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Recipient name"><input required type="text" className="input" /></Field>
                <Field label="Recipient email"><input required type="email" className="input" /></Field>
                <Field label="Your name"><input required type="text" className="input" /></Field>
                <Field label="Your email"><input required type="email" className="input" /></Field>
              </div>

              <Field label="Personal message (optional)">
                <textarea rows={3} className="input resize-none" placeholder="Happy birthday!" />
              </Field>

              <button type="submit" className="w-full rounded-md py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "var(--brand-blue)" }} disabled={!finalAmount}>
                Place Gift Card Order — ${finalAmount || 0}
              </button>
              <p className="text-center text-xs text-muted-foreground">Payment processing is coming soon. This form is a placeholder.</p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 2px solid var(--color-border);
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
        }
        .input:focus { border-color: var(--brand-blue); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
