import ModelCustom from "./ModelCustom";
import { Button } from "./ui/button";
import { z } from "zod";
import CustomForm from "./CustomForm";
import Spinner from "./Spinner";
import { ProductProps } from "@/types";
import { useGetEntity } from "@/utils/QueryFunctions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  group: z.string().optional(),
  subGroups: z.array(z.any().optional()).optional(),
  stock: z
    .union([z.string().min(1, { message: "Stock must be at least 1" }), z.number()])
    .transform((value) => Number(value)),
});
const Create = ({
  name,
  page,
  product,
  btn,
}: {
  name: string;
  page: number;
  product?: ProductProps;
  btn?: JSX.Element;
}) => {
  const { data, isLoading } = useGetEntity("groups", page, 20);
  const groups = data?.data.data.docs;
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      group: product?.group?._id,
      subGroups: product?.subGroups,
      //@ts-ignore
      stock: product?.stock ? String(product.stock) : "0",
    },
  });
  const productArray = [
    {
      name: "name",
      label: "Name",
      placeholder: "Add a name to your product...",
      description: "",
      id: "title-2",
    },
    {
      name: "stock",
      label: "Stock",
      placeholder: "Add a stock to your product...",
      description: "",
      id: "title-2",
      type: "number",
    },
    {
      name: "group",
      label: "Group",
      select: true,
      placeholder: "Add Your Product to a group...",
      description: "Choose A Group or a Category for your product to be classified under it.",
      id: "title-3",
      options: groups,
    },
    ...(form.getValues("group")
      ? groups
          ?.filter((option: any) => option._id === form.getValues("group"))[0]
          ?.subgroups?.flatMap((g: any, i: number) => ({
            select: true,
            name: `subGroups.${i}`,
            label: `subGroup ${i + 1}`,
            id: `title-${4 + i}`,
            options: g.options,
          }))
      : []),
  ];
  return (
    <ModelCustom
      content={
        isLoading ? (
          <Spinner />
        ) : (
          <CustomForm
            noimg
            id={product?._id || ""}
            form={form}
            titles={productArray.map((p) => `#${p.id}`)}
            inputs={productArray}
            schema={productSchema}
            entityType="products"
            text={`${product ? `Edit ${name}` : "Create new product"}`}
          />
        )
      }
      text="Here you can create a new item"
      title={`Upload a new ${name}`}
      value={name}
      btn={btn || <Button>Create {name}</Button>}
    />
  );
};

export default Create;
