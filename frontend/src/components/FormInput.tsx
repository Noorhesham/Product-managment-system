import { Trash2Icon } from "lucide-react";
import { InputProps } from "./CustomForm";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useFormContext } from "react-hook-form";

const FormInput = ({ name, label, placeholder, description, id, type, removeOp }: InputProps) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem id={id || ""} className="flex  flex-col items-start ">
          <FormLabel className=" ">{label}</FormLabel>
          <FormControl className="">
            <div className="flex items-center w-full">
              <Input type={type || "text"} className=" " placeholder={placeholder} {...field} />
              {removeOp && (
                <button onClick={() => removeOp()} className=" p-1 text-red-400 hover:text-red-500">
                  <Trash2Icon />
                </button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}.</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
