import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { formRows, sendFormNotification } from "../email.server";

const vipSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

const employmentSchema = z.object({
  fields: z.record(z.union([z.string(), z.array(z.string())])),
});

export const submitVipSignup = createServerFn({ method: "POST" })
  .validator(vipSchema)
  .handler(async ({ data }) => {
    const rows = formRows({
      Email: data.email,
      Phone: data.phone,
      "Favorite location": data.location,
    });

    await sendFormNotification({
      subject: "New BRG VIP Club signup",
      replyTo: data.email,
      html: `<h2>BRG VIP Club signup</h2><table>${rows}</table>`,
    });

    return { ok: true as const };
  });

export const submitEmploymentApplication = createServerFn({ method: "POST" })
  .validator(employmentSchema)
  .handler(async ({ data }) => {
    const email =
      typeof data.fields.Email === "string"
        ? data.fields.Email
        : typeof data.fields.email === "string"
          ? data.fields.email
          : undefined;

    const rows = formRows(
      Object.fromEntries(
        Object.entries(data.fields).map(([k, v]) => [k, v]),
      ),
    );

    await sendFormNotification({
      subject: "New BRG employment application",
      replyTo: email,
      html: `<h2>Employment application</h2><table>${rows}</table><p style="margin-top:16px;font-size:12px;color:#666">Submitted via brgrill.com employment form.</p>`,
    });

    return { ok: true as const };
  });
