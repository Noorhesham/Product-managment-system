import { useGetInfiniteScrollProduct } from "@/utils/QueryFunctions";
import { useFormContext } from "react-hook-form";
import { InputProps } from "./CustomForm";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "./Spinner";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Input } from "./ui/input";

const ProductSelect = ({ name, label, description, id, selected, defaultValue }: InputProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteScrollProduct();
  const form = useFormContext();
  const selectedValue = form.watch(name);
  const { ref, inView } = useInView();
  useEffect(
    function () {
      if (inView && hasNextPage) fetchNextPage();
    },
    [inView, hasNextPage, fetchNextPage]
  );
  const options = data?.pages.flatMap((page) => page.data?.docs);
  // Filter out the selected value from the options
  const filteredOptions = options?.filter((p) => !selected?.includes(p._id));
  useEffect(() => {
    if (defaultValue && !form.getValues(name)) {
      form.setValue(name, defaultValue);
    }
  }, [defaultValue, form, name]);
  useEffect(() => {
    if (defaultValue && !form.getValues(name)) {
      form.setValue(name, defaultValue);
    }
  }, [defaultValue, form, name]);
  const selectedProduct = options?.find((p) => p._id === form.getValues(name)?._id || p._id === selectedValue);
  console.log(selectedProduct)
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedOption = options?.find((p) => p._id === form.getValues(name)?._id || p._id === field.value);
        return (
          <FormItem id={id || ""}>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue> {selectedOption ? selectedOption.name : "Select a product"}</SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent className=" overflow-y-scroll max-h-40">
                {filteredOptions &&
                  filteredOptions.map((option, i) => (
                    <SelectItem key={i} value={option._id || option}>
                      {option.name || option}
                    </SelectItem>
                  ))}
                <div className=" min-h-10" ref={ref}>
                  {isFetchingNextPage || isLoading ? <Spinner /> : null}
                </div>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <div>
                <label htmlFor="total">Stock</label>
                <Input disabled value={selectedProduct?.stock} />
              </div>

              <div>
                <label htmlFor="total">purchase Price</label>
                <Input disabled value={selectedProduct?.lastPurchasePrice} />
              </div>
            </div>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ProductSelect;
