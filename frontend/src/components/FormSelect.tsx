import { useFormContext } from "react-hook-form";
import { InputProps } from "./CustomForm";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const FormSelect = ({ name, label, placeholder, description, id, options, selected, defaultValue }: InputProps) => {
  const form = useFormContext();
  const selectedValue = form.watch(name);

  // Filter out the selected value from the options
  const filteredOptions = options?.filter((p) => !selected?.includes(p._id));
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selected = options?.find((p) => p._id === form.getValues(name)?._id || p._id === selectedValue);
        return (
          <FormItem id={id || ""}>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue>{selected ? selected.name : placeholder}</SelectValue>
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
