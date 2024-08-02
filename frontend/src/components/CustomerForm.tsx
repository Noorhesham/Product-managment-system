import { CustomerProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import CustomForm from "./CustomForm";
import ModelCustom from "./ModelCustom";

const customerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  phoneNumber: z.string().min(3, { message: "Name must be at least 3 characters" }),
  address: z.string().min(3, { message: "Name must be at least 3 characters" }),
});
const CustomerForm = ({ customer, btn }: { customer?: CustomerProps; btn?: JSX.Element }) => {
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      phoneNumber: customer?.phoneNumber || "",
      address: customer?.address || "",
    },
  });
  const customerArray = [
    {
      name: "name",
      label: "Name",
      placeholder: "Add a name to your customer...",
      description: "We'll never share your name.",
      id: "title-2",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "Add a phone number to your customer...",
      description: "We'll never share your phone number.",
      id: "title-3",
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Add an address to your customer...",
      description: "We'll never share your address.",
      id: "title-4",
    },
  ];
  return (
    <div>
      <ModelCustom
        btn={btn || <Button>Create Customer</Button>}
        text="Customer "
        title=""
        content={
          <div>
            <CustomForm
              entityType="customers"
              id={customer?._id}
              noimg
              schema={customerSchema}
              titles={customerArray.map((p) => `#${p.id}`)}
              form={form}
              inputs={customerArray}
              serverError={""}
              defaultValues={form.getValues()}
              text={`${customer?._id ? "Edit" : "Add"} Customer`}
            />
          </div>
        }
      />
    </div>
  );
};

export default CustomerForm;
