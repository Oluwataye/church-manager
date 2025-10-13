
import * as z from "zod";

export const titheFormSchema = z.object({
  date: z.date(),
  memberId: z.string().min(1, "Member is required"),
  amount: z.string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid positive number with up to 2 decimal places")
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0")
    .refine((val) => parseFloat(val) <= 10000000, "Amount must be less than 10,000,000"),
  month: z.string().min(1, "Month is required"),
  notes: z.string().optional(),
});

export type TitheFormValues = z.infer<typeof titheFormSchema>;

export const TITHE_MONTHS = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
];
