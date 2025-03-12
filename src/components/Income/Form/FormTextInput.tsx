
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface FormTextInputProps {
  control: Control<any>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
}

export function FormTextInput({ 
  control, 
  name, 
  label, 
  type = "text",
  placeholder = "", 
  optional = false 
}: FormTextInputProps) {
  return (
    <FormField
      control={control}
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
