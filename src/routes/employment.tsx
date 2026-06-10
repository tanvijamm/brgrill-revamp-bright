import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { submitEmploymentApplication } from "@/lib/api/forms.functions";
import { LOCATION_LIST } from "@/lib/locations";

function formDataToFields(fd: FormData): Record<string, string | string[]> {
  const fields: Record<string, string | string[]> = {};
  for (const [key, value] of fd.entries()) {
    if (typeof value !== "string") continue;
    const existing = fields[key];
    if (existing === undefined) fields[key] = value;
    else if (Array.isArray(existing)) existing.push(value);
    else fields[key] = [existing, value];
  }
  return fields;
}

export const Route = createFileRoute("/employment")({
  head: () => ({
    meta: [
      { title: "Employment Opportunities — Blue Ridge Grill" },
      {
        name: "description",
        content:
          "Join the BRG family. Apply for server, bartender, hostess, kitchen, and management positions at our Ashburn, Brambleton, and Leesburg locations.",
      },
    ],
  }),
  component: Employment,
});

const POSITIONS = ["Hostess", "Server", "Kitchen", "Support", "Any"] as const;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const EDUCATION = [
  "Some High School (No GED)",
  "Some High School (GED)",
  "High School (Diploma)",
  "Some College",
  "College (Diploma)",
] as const;

function Employment() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <section style={{ backgroundColor: "var(--brand-cream)" }}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--brand-green)" }}
          >
            Careers
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Join the BRG Family</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            BRG is always looking for dedicated, talented servers, bartenders, managers, hostesses,
            and kitchen staff. We offer competitive salaries and a fun, family working environment.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            To apply, please fill in the application below and a member of our management staff will
            be in contact when a position becomes available.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {submitted ? (
          <div
            className="rounded-xl border-2 p-8 text-center"
            style={{
              borderColor: "var(--brand-green)",
              backgroundColor: "color-mix(in oklab, var(--brand-green) 12%, white)",
            }}
          >
            <h2 className="font-display text-2xl font-bold">Application received — thank you!</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Your application has been sent to our management team. We'll reach out when a matching
              position opens. You can also inquire in person at any location.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-md px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand-blue)" }}
            >
              Submit another application
            </button>
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              setError(null);
              try {
                const fields = formDataToFields(new FormData(e.currentTarget));
                await submitEmploymentApplication({ data: { fields } });
                setSubmitted(true);
              } catch {
                setError("Could not submit your application. Please try again or apply in person at any location.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Section title="Position & location">
              <Field label="BRG location applying for" required>
                <div className="mt-2 flex flex-wrap gap-4">
                  {LOCATION_LIST.map((loc) => (
                    <label key={loc.slug} className="flex items-center gap-2 text-sm">
                      <input type="radio" name="location" required value={loc.slug} className="accent-[var(--brand-blue)]" />
                      {loc.name}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Position desired (select all that apply)" required className="mt-5">
                <div className="mt-2 flex flex-wrap gap-4">
                  {POSITIONS.map((pos) => (
                    <label key={pos} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="position" value={pos} className="accent-[var(--brand-blue)]" />
                      {pos}
                    </label>
                  ))}
                </div>
              </Field>
            </Section>

            <Section title="Applicant information">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" required>
                  <input required name="First name" type="text" className="input" autoComplete="given-name" />
                </Field>
                <Field label="Last name" required>
                  <input required name="Last name" type="text" className="input" autoComplete="family-name" />
                </Field>
                <Field label="Street address" required className="sm:col-span-2">
                  <input required name="Street address" type="text" className="input" autoComplete="street-address" />
                </Field>
                <Field label="Address line 2" className="sm:col-span-2">
                  <input name="Address line 2" type="text" className="input" placeholder="Apt, suite, etc. (optional)" />
                </Field>
                <Field label="City" required>
                  <input required name="City" type="text" className="input" autoComplete="address-level2" />
                </Field>
                <Field label="State / Province" required>
                  <input required name="State" type="text" className="input" maxLength={2} placeholder="VA" autoComplete="address-level1" />
                </Field>
                <Field label="ZIP / Postal code" required>
                  <input required name="ZIP" type="text" className="input" inputMode="numeric" autoComplete="postal-code" />
                </Field>
                <Field label="Country" required>
                  <input required name="Country" type="text" className="input" defaultValue="United States" autoComplete="country-name" />
                </Field>
                <Field label="Email" required>
                  <input required name="Email" type="email" className="input" autoComplete="email" />
                </Field>
                <Field label="Phone number — home">
                  <input name="Phone (home)" type="tel" className="input" autoComplete="tel" />
                </Field>
                <Field label="Phone number — cell">
                  <input name="Phone (cell)" type="tel" className="input" autoComplete="tel-national" />
                </Field>
              </div>

              <Field label="Days available to work" required className="mt-5">
                <div className="mt-2 flex flex-wrap gap-3">
                  {DAYS.map((day) => (
                    <label key={day} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="days" value={day} className="accent-[var(--brand-blue)]" />
                      {day}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Schedule obligations" hint="Explain any obligations that may interfere with your schedule" className="mt-4">
                <textarea name="Schedule obligations" rows={2} className="input resize-none" />
              </Field>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="Desired start date — month" required>
                  <input required name="Start date (month)" type="text" className="input" placeholder="MM" maxLength={2} />
                </Field>
                <Field label="Day" required>
                  <input required name="Start date (day)" type="text" className="input" placeholder="DD" maxLength={2} />
                </Field>
                <Field label="Year" required>
                  <input required name="Start date (year)" type="text" className="input" placeholder="YYYY" maxLength={4} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Desired number of hours per week" required>
                  <input required name="Hours per week" type="text" className="input" />
                </Field>
                <Field label="Desired salary or hourly rate of pay" required>
                  <input required name="Desired pay" type="text" className="input" />
                </Field>
                <Field label="Highest education" required>
                  <select required name="Highest education" className="input" defaultValue="">
                    <option value="" disabled>
                      Select…
                    </option>
                    {EDUCATION.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Dates attended" required>
                  <input required name="Dates attended" type="text" className="input" placeholder="e.g. 2018 – 2022" />
                </Field>
              </div>

              <Field label="Have you ever worked for or applied to Blue Ridge Grill before?" required className="mt-4">
                <div className="mt-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="brg-before" required value="yes" className="accent-[var(--brand-blue)]" />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="brg-before" value="no" className="accent-[var(--brand-blue)]" />
                    No
                  </label>
                </div>
              </Field>
              <Field label="If yes, when?" className="mt-3">
                <input name="Previously applied (when)" type="text" className="input" />
              </Field>
            </Section>

            <Section title="Previous employment" hint="List your last three places of employment, most recent first.">
              {[1, 2, 3].map((n) => (
                <div key={n} className={n > 1 ? "mt-6 border-t pt-6" : ""}>
                  <h3 className="text-sm font-semibold text-muted-foreground">Employer {n}</h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <Field label="Employer name">
                      <input name={`Employer ${n} — name`} type="text" className="input" />
                    </Field>
                    <Field label="Dates worked">
                      <input name={`Employer ${n} — dates`} type="text" className="input" placeholder="e.g. Jan 2020 – Mar 2023" />
                    </Field>
                    <Field label="Position held">
                      <input name={`Employer ${n} — position`} type="text" className="input" />
                    </Field>
                    <Field label="Employer phone number">
                      <input name={`Employer ${n} — phone`} type="tel" className="input" />
                    </Field>
                    <Field label="Reason for leaving" className="sm:col-span-2">
                      <input name={`Employer ${n} — reason for leaving`} type="text" className="input" />
                    </Field>
                  </div>
                </div>
              ))}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="May we contact your former employers for references?">
                  <div className="mt-2 flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="contact-employers" value="yes" className="accent-[var(--brand-blue)]" />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="contact-employers" value="no" className="accent-[var(--brand-blue)]" />
                      No
                    </label>
                  </div>
                </Field>
                <Field label="Did you give two weeks notice to your last employer?">
                  <div className="mt-2 flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="two-weeks" value="yes" className="accent-[var(--brand-blue)]" />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="two-weeks" value="no" className="accent-[var(--brand-blue)]" />
                      No
                    </label>
                  </div>
                </Field>
              </div>
              <Field label="How would your last employer describe you?" className="mt-4">
                <textarea name="Employer description" rows={2} className="input resize-none" />
              </Field>
            </Section>

            <Section title="Additional information">
              <Field label="Have you ever been convicted of a felony?" required>
                <div className="mt-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="felony" required value="yes" className="accent-[var(--brand-blue)]" />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="felony" value="no" className="accent-[var(--brand-blue)]" />
                    No
                  </label>
                </div>
              </Field>
              <Field label="Why are you wanting to apply with us?" required className="mt-4">
                <textarea required name="Why apply" rows={3} className="input resize-none" />
              </Field>
            </Section>

            <Section
              title="Server applicants only"
              hint="All servers must work a minimum of 4 shifts — 2 am and 2 pm shifts, including Sunday availability."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="How many shifts per week do you want to work?">
                  <input name="Shifts per week" type="text" className="input" />
                </Field>
                <Field label="Are you available to work on Sundays?">
                  <div className="mt-2 flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="sunday" value="yes" className="accent-[var(--brand-blue)]" />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="sunday" value="no" className="accent-[var(--brand-blue)]" />
                      No
                    </label>
                  </div>
                </Field>
                <Field label="Collectively, how long have you worked in the restaurant industry?" className="sm:col-span-2">
                  <input name="Industry experience" type="text" className="input" />
                </Field>
                <Field label="What makes a good restaurant successful?" className="sm:col-span-2">
                  <textarea name="Restaurant success" rows={2} className="input resize-none" />
                </Field>
                <Field label="What do you want to be doing six months from now?" className="sm:col-span-2">
                  <textarea name="Six month goals" rows={2} className="input resize-none" />
                </Field>
              </div>
            </Section>

            <Section title="Electronic signature">
              <p className="mb-4 text-sm text-muted-foreground">
                By signing below you certify that the above facts are accurate and complete to the
                best of your knowledge.
              </p>
              <Field label="Full legal name (electronic signature)" required>
                <input required name="Electronic signature" type="text" className="input" placeholder="Type your full name" />
              </Field>
            </Section>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md py-3.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-10"
              style={{ backgroundColor: "var(--brand-blue)" }}
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          </form>
        )}
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
          transition: border-color .15s;
        }
        .input:focus { border-color: var(--brand-blue); }
      `}</style>
    </>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--brand-blue)" }}>
          {title}
        </h2>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-sm font-semibold">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </span>
      {hint && !children && (
        <span className="mt-0.5 block text-[11px] text-muted-foreground">{hint}</span>
      )}
      <div className="mt-1">{children}</div>
      {hint && children && (
        <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
      )}
    </label>
  );
}
