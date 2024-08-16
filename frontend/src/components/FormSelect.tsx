import { useFormContext } from "react-hook-form";
import { InputProps } from "./CustomForm";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSelect = ({ name, label, placeholder, description, id, options, selected }: InputProps) => {
  const form = useFormContext();

  // Filter out the selected value from the options
  const filteredOptions = name === "customer" ? options : options?.filter((p) => !selected?.includes(p._id));

  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => {
        const selectedOption = options?.find((p) => p._id === field.value);
        return (
          <FormItem id={id || ""}>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value); // Update the form state with the selected value
              }}
              value={field.value} // Bind the select value to the form state
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue>{selectedOption ? selectedOption.name : placeholder}</SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredOptions &&
                  filteredOptions.map((option, i) => (
                    <SelectItem key={i} value={option._id || option}>
                      {option.name || option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormSelect;
