import { usePage } from "@/context/PageProvider";
import { PurchasesProps } from "@/types";
import { useUploadEntity } from "@/utils/QueryFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ModelCustom from "./ModelCustom";
import { Button } from "./ui/button";
import FormInput from "./FormInput";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { Trash2Icon } from "lucide-react";
import ProductSelect from "./ProductSelect";

const purchaseSchema = z.object({
  items: z.array(
    z.object({
      product: z
        .union([z.string().min(1, "Product is required"), z.any()])
        .transform((value) => (typeof value === "string" ? value : value._id)),
      quantity: z
        .union([z.string().min(1, "Quantity is required"), z.number()])
        .transform((value) => Number(value)),
      purchasePrice: z
        .union([z.string().min(1, "Quantity is required"), z.number()])
        .transform((value) => Number(value)),
    })
  ),
});

const PurchaseForm = ({ purchase, btn }: { purchase?: PurchasesProps; btn?: JSX.Element }) => {
  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      items: purchase?.items || [
        {
          product: "",
          quantity: 0,
          purchasePrice: 0,
        },
      ],
    },
  });
  console.log(form.formState.errors, purchase?.items);
  const { page } = usePage();
  const { uploadEntity, isPending } = useUploadEntity("purchases", page, purchase?._id);
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const selectedProducts = form
    .watch("items")
    .map((item) => item.product)
    .filter((i) => i !== "");
  const onSubmit = (data: z.infer<typeof purchaseSchema>) => {
    console.log(data);
    uploadEntity(data);
  };
  return (
    <div>
      <ModelCustom
        btn={btn || <Button>Purchase Product</Button>}
        text="Purchase Product"
        title=""
        content={
          <div>
            <div>
              <Form {...form}>
                <form className="flex items-stretch gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-1 flex-col">
                    <div className="flex pt-5 flex-col gap-4">
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
                            <FormInput type="number" label="Purchase Price" name={`items.${index}.purchasePrice`} />
                            <div>
                              <label htmlFor="total">Total</label>
                              <Input
                                disabled
                                value={
                                  form.getValues(`items.${index}.quantity`) *
                                  form.getValues(`items.${index}.purchasePrice`)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        disabled={isPending}
                        className=" mt-2 w-fit ml-auto"
                        variant={"outline"}
                        onClick={(e) => {
                          e.preventDefault();
                          append({ product: "", quantity: 0, purchasePrice: 0 });
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

export default PurchaseForm;
