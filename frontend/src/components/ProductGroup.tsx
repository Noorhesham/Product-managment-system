import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import CustomForm from "./CustomForm";
import { Button } from "./ui/button";
import ModelCustom from "./ModelCustom";
import { GroupProps } from "@/types";
import { ReactNode } from "react";

const productGroupSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  subgroups: z
    .array(
      z
        .object({
          name: z.string().min(3, { message: "Name must be at least 3 characters" }),
          options: z
            .union([
              z.string().transform((value) => value.split(",").map((option) => option.trim())),
              z.array(z.string()),
            ])
            //transform :This method is used to modify the input data. It splits the input string by commas and trims any leading
            //or trailing whitespace from each resulting string.
            // .transform((value) => value.split(",").map((option) => option.trim())) // Split by commas and trim spaces
            //e: After the transformation, this method checks that each item in the resulting array meets the specified condition
            //(e.g., minimum length of 2 characters). If any item fails the condition, a validation error is thrown
            .refine(
              (optionsArray) => Array.isArray(optionsArray) && optionsArray.every((option) => option.length >= 2),
              { message: "Each option must be at least 2 characters long" }
            ),
        })
        .optional()
    )
    .optional(),
});
const ProductGroup = ({ group, btn }: { group?: GroupProps; btn?: ReactNode }) => {
  const form = useForm<z.infer<typeof productGroupSchema>>({
    resolver: zodResolver(productGroupSchema),
    defaultValues: {
      name: group?.name || "",
      subgroups: group?.subgroups || [],
    },
  });
  const { append, fields,remove } = useFieldArray({
    control: form.control,
    name: "subgroups",
  });
  form.watch('subgroups');
  
  const productGroupArray = [
    {
      name: "name",
      label: "Name",
      placeholder: "Add a name to your product...",
      description: "",
      id: "title-2",
    },
    ...fields.map((field, i) => ({
      name: `subgroups.${i}.name`,
      label: `Subgroup ${i + 1}`,
      id: `title-${i + 3}`,removeOp:()=>{
        form.setValue(`subgroups.${i}`,undefined)
        remove(i)
        console.log(form.getValues('subgroups'))
      }
    })),
    // Input for options
    ...fields.map((field, i) => ({
      name: `subgroups.${i}.options`,
      label: `Options for Subgroup ${i + 1}`,
      placeholder: "Enter options separated by commas...",
      id: `options-${i + 3}`,
      type: "text",
    })),
  ];

  return (
    <div>
      <ModelCustom
        btn={btn || <Button>Create group product</Button>}
        text="Product Group"
        title=""
        content={
          <div>
            <CustomForm
              entityType="groups"
              id={group?._id}
              noimg
              schema={productGroupSchema}
              titles={productGroupArray.map((p) => `#${p.id}`)}
              form={form}
              inputs={productGroupArray}
              serverError={""}
              defaultValues={form.getValues()}
              text={`${group?._id ? "Edit" : "Add"} Product Group`}
            />
            <Button  className=" mt-2" variant={"outline"} onClick={() => append({ name: "", options: [] })}>
              {"Add Option"}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default ProductGroup;
