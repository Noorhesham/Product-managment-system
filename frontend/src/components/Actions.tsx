import { useDeleteEntity } from "@/utils/QueryFunctions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Delete } from "@/components/Delete";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { usePage } from "@/context/PageProvider";
import Create from "./Create";
import { CustomerProps, GroupProps, ProductProps, PurchasesProps, SellProps, typeProps } from "@/types";
import ProductGroup from "./ProductGroup";
import EditButton from "./EditButton";
import CustomerForm from "./CustomerForm";
import SellForm from "./SellForm";
import { SheetDemo } from "./SheetTrig";
import PurchaseForm from "./PurchaseForm";

const Actions = ({
  product,
  type,
  sheet,
  id,
  item,
}: {
  product?: ProductProps | GroupProps | CustomerProps | SellProps | PurchasesProps;
  type: typeProps;
  sheet?: boolean;
  id?: string;
  item?: any;
}) => {
  const { page } = usePage();
  const { deleteEntity, isPending } = useDeleteEntity(type, product?._id || "", page);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {sheet && id && <SheetDemo entity={type} text={"Details For Sell"} id={id} />}
        {product ? (
          type === "groups" ? (
            <ProductGroup btn={<EditButton text={`Edit ${product.name} `} />} group={product as GroupProps} />
          ) : type === "customers" ? (
            <CustomerForm btn={<EditButton text={`Edit ${product.name} `} />} customer={product as CustomerProps} />
          ) : type === "sells" ? (
            <SellForm btn={<EditButton text={`Edit Sell `} />} sell={product as SellProps} />
          ) : type === "purchases" ? (
            <PurchaseForm />
          ) : (
            <Create
              btn={<EditButton text={`Edit ${product.name} `} />}
              name={product.name}
              page={page}
              product={product as ProductProps}
            />
          )
        ) : null}
        <DropdownMenuSeparator />
        {product && (
          <DropdownMenuItem>
            <Link to={`/products/${product._id}`}>View {product.name} Details</Link>
          </DropdownMenuItem>
        )}
        {product && (
          <Delete
            disabled={isPending}
            btn={
              <Button variant="destructive" className=" mt-3 w-full  text-left">
                {isPending ? <Spinner /> : `Delete ${product.name || ""}`}
              </Button>
            }
            onClick={()=>deleteEntity(product?._id)}
            value={`Delete ${product.name || ""}`}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
