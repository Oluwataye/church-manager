
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { INCOME_CATEGORY_OPTIONS, SERVICE_TYPE_OPTIONS } from "./incomeFormSchema";

interface FormCategorySelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  selectType: "service" | "category";
}

export function FormCategorySelect({ 
  form, 
  name, 
  label, 
  selectType 
}: FormCategorySelectProps) {
  const options = selectType === 'service' ? SERVICE_TYPE_OPTIONS : INCOME_CATEGORY_OPTIONS;
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${selectType}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
