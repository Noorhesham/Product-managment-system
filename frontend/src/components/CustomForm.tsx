import React, { useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "./ui/button";
import Spinner from "./Spinner";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { useUploadEntity } from "@/utils/QueryFunctions";
import { typeProps } from "@/types";
import { usePage } from "@/context/PageProvider";
import { Form } from "./ui/form";

export interface InputProps {
  name: string;
  type?: string;
  placeholder?: string;
  description?: string;
  label: string;
  id?: string;
  options?: any[];
  select?: boolean;
  removeOp?: any;
  selected?: any;
  defaultValue?: any;
}

export interface CustomFormProps {
  inputs: InputProps[];
  src?: string;
  serverError?: string | null;
  title?: string;
  noimg?: boolean;
  text?: string;
  schema: z.ZodType<any>;
  entityType: typeProps;
  //@ts-ignore
  defaultValues?: Partial<z.infer<typeof schema>>;
  id?: string;
  form?: any;
  titles?: string[];
  localSubmit?: any;
}

const CustomForm: React.FC<CustomFormProps> = ({
  inputs,
  src,
  serverError,
  title,
  noimg = false,
  text,
  schema,
  entityType,
  defaultValues,
  id,
  form,
  localSubmit,
}) => {
  const LocalRef = useRef<HTMLDivElement>(null);
  const { page } = usePage();
  const { uploadEntity, isPending } = useUploadEntity(entityType, page, id);

  // const methods = useForm<z.infer<typeof schema>>({
  //   resolver: zodResolver(schema),
  //   defaultValues,
  // });

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from([LocalRef.current], {
        opacity: 0,
        y: 50,
        stagger: 0.3,
      });
    },
    { scope: LocalRef }
  );

  const onSubmit = (data: z.infer<typeof schema>) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== null && value !== "")
    );
    uploadEntity(filteredData);
  };
  const localForm = form;
  return (
    <Form {...localForm}>
      <form className="flex items-stretch gap-2" onSubmit={form.handleSubmit(localSubmit || onSubmit)}>
        <div ref={LocalRef} className="flex flex-1 flex-col">
          {title && <h1 className="text-3xl mt-5 font-semibold mb-5">{title}</h1>}
          <div className="flex pt-10 flex-col gap-4">
            {inputs.map((input) =>
              input.select ? <FormSelect key={input.name} {...input} /> : <FormInput key={input.name} {...input} />
            )}
          </div>
          {serverError && <p className="text-red-500 mt-5 text-sm">{serverError}</p>}
          <Button className="mt-5">{isPending ? <Spinner /> : text || "Submit"}</Button>
        </div>
        {!noimg && src && (
          <div className="relative">
            <img id="slide-img" src={src} alt="Form visual" className="w-[30rem] object-cover" />
          </div>
        )}
      </form>
    </Form>
  );
};

export default CustomForm;
