import * as z from "zod";

export const memberFormSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  phone: z.string()
    .regex(/^[0-9+\-\(\)\s]{7,20}$/, "Invalid phone format (7-20 digits, can include +, -, (), spaces)")
    .optional()
    .or(z.literal("")),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
