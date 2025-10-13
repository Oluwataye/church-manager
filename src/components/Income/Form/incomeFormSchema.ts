
import * as z from "zod";

export const incomeFormSchema = z.object({
  date: z.date(),
  serviceType: z.string(),
  category: z.string(),
  amount: z.string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid positive number with up to 2 decimal places")
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0")
    .refine((val) => parseFloat(val) <= 10000000, "Amount must be less than 10,000,000"),
  description: z.string().optional(),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;

export const SERVICE_TYPE_OPTIONS = [
  { value: "sunday", label: "Sunday Service" },
  { value: "midweek", label: "Midweek Service" },
  { value: "special", label: "Special Event" },
];

export const INCOME_CATEGORY_OPTIONS = [
  { value: "tithe", label: "Tithe" },
  { value: "offering", label: "Worship Offering" },
  { value: "thanksgiving", label: "Thanksgiving" },
  { value: "prophet", label: "Prophet Offering" },
  { value: "project", label: "Project Offering" },
  { value: "shiloh", label: "Shiloh Offering" },
];
