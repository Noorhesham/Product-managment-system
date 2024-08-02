import { SellProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ModelCustom from "./ModelCustom";
import { Button } from "./ui/button";
import FormInput from "./FormInput";
import { Form } from "./ui/form";
import FormSelect from "./FormSelect";
import { useGetEntity, useUploadEntity } from "@/utils/QueryFunctions";
import Spinner from "./Spinner";
import { Trash2Icon } from "lucide-react";
import { Input } from "./ui/input";
import ProductSelect from "./ProductSelect";

const sellSchema = z.object({
  items: z.array(
    z.object({
      product: z.string().min(1, "Product is required"),
      quantity: z
        .string()
        .min(1, "Quantity is required")
        .transform((value) => parseInt(value)),
      sellPrice: z
        .string()
        .min(1, "Sell price is required")
        .transform((value) => parseFloat(value)),
      customerPaidForAllQuantity: z
        .string()
        .min(1, "Customer paid is required")
        .transform((value) => parseFloat(value)),
    })
  ),
  customer: z.string().min(1, "Customer is required"),
});
const SellForm = ({ sell, btn }: { sell?: SellProps; btn?: JSX.Element }) => {
  const form = useForm<z.infer<typeof sellSchema>>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      items: sell?.items || [
        {
          product: "",
          quantity: 0,
          sellPrice: 0,
          customerPaidForAllQuantity: 0,
        },
      ],
      customer: sell?.customer._id || "",
    },
  });

  const { data: data2, isLoading: isLoading2 } = useGetEntity("customers", 1, 20);
  const { uploadEntity, isPending } = useUploadEntity("sells", 1);
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const selectedProducts = form
    .watch("items")
    .map((item) => item.product)
    .filter((i) => i !== "");

  console.log(sell);
  const onSubmit = (data: z.infer<typeof sellSchema>) => {
    console.log(data);
    uploadEntity(data);
  };
  form.watch("items");
  return (
    <div>
      <ModelCustom
        btn={btn || <Button>Sell Product</Button>}
        text="Sell Product"
        title=""
        content={
          <div>
            <div>
              <Form {...form}>
                <form className="flex items-stretch gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-1 flex-col">
                    <div className="flex pt-5 flex-col gap-4">
                      {isLoading2 ? (
                        <Spinner />
                      ) : (
                        <FormSelect label="Customer" name="customer" options={data2?.data.data.docs} />
                      )}
                      {fields.map((_, index) => (
                        <div key={index}>
                          {
                            <div className=" flex  gap-2 w-full">
                              <div className=" flex-grow">
                                <ProductSelect
                                  selected={selectedProducts}
                                  label="Product"
                                  name={`items.${index}.product`}
                                />
                              </div>
                              <button
                                onClick={() => remove(index)}
                                className=" p-1 my-auto text-red-400 hover:text-red-500"
                              >
                                <Trash2Icon />
                              </button>
                            </div>
                          }
                          <div className=" flex flex-wrap items-center gap-3 mt-3">
                            <FormInput type="number" label="quantity" name={`items.${index}.quantity`} />
                            <FormInput type="number" label="Sell Price" name={`items.${index}.sellPrice`} />
                            <div>
                              <label htmlFor="total">Total</label>
                              <Input
                                disabled
                                value={
                                  form.getValues(`items.${index}.quantity`) * form.getValues(`items.${index}.sellPrice`)
                                }
                              />
                            </div>
                            <FormInput
                              type="number"
                              label="Customer paid"
                              name={`items.${index}.customerPaidForAllQuantity`}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        disabled={isPending}
                        className=" mt-2 w-fit ml-auto"
                        variant={"outline"}
                        onClick={(e) => {
                          e.preventDefault();
                          append({ product: "", quantity: 0, sellPrice: 0, customerPaidForAllQuantity: 0 });
                        }}
                      >
                        {"Add Product"}
                      </Button>
                    </div>
                    <Button className=" mt-4 mb-3">Submit</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SellForm;
