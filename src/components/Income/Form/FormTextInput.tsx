
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface FormTextInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
}

export function FormTextInput({ 
  form, 
  name, 
  label, 
  type = "text",
  placeholder = "", 
  optional = false 
}: FormTextInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{optional && " (Optional)"}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
