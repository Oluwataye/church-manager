
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormDatePicker } from "./Form/FormDatePicker";
import { FormCategorySelect } from "./Form/FormCategorySelect";
import { FormTextInput } from "./Form/FormTextInput";
import { useIncomeForm } from "./Form/useIncomeForm";
import { 
  SERVICE_TYPE_OPTIONS, 
  INCOME_CATEGORY_OPTIONS 
} from "./Form/incomeFormSchema";

export function IncomeForm() {
  const { form, onSubmit, isPending } = useIncomeForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormDatePicker 
          control={form.control} 
          name="date" 
          label="Date" 
        />

        <FormCategorySelect
          control={form.control}
          name="serviceType"
          label="Service Type"
          placeholder="Select service type"
          options={SERVICE_TYPE_OPTIONS}
        />

        <FormCategorySelect
          control={form.control}
          name="category"
          label="Category"
          placeholder="Select income category"
          options={INCOME_CATEGORY_OPTIONS}
        />

        <FormTextInput
          control={form.control}
          name="amount"
          label="Amount (₦)"
          type="number"
        />

        <FormTextInput
          control={form.control}
          name="description"
          label="Description"
          optional={true}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Recording..." : "Record Income"}
        </Button>
      </form>
    </Form>
  );
}
