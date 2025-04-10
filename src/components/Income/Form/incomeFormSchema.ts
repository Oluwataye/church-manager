
import * as z from "zod";

export const incomeFormSchema = z.object({
  date: z.date(),
  serviceType: z.string(),
  category: z.string(),
  amount: z.string().min(1),
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
