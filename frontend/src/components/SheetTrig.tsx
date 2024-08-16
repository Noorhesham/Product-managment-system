import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { typeProps } from "@/types";
import { useGetEntityById } from "@/utils/QueryFunctions";
import Spinner from "./Spinner";
import SheetItem from "./SheetItem";
import { Link } from "react-router-dom";

export function SheetDemo({ text, id, entity }: { text: string; id: string; entity: typeProps }) {
  const { data, isLoading } = useGetEntityById(entity, id);
  const docs = data?.data.data.doc;
  console.log(docs);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className= " w-full my-2 underline" variant="outline">
          {text}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{entity} Details</SheetTitle>
          <SheetDescription>Here are the details of the {entity}</SheetDescription>
        </SheetHeader>
        {isLoading ? <Spinner /> : docs.items.map((item: any) => <SheetItem type={entity} wholeItem={item} item={item.product} key={item._id} />)}
        {docs?.customer && (
          <p className=" text-sm  text-primary underline mb-2">
            Sold To <Link to={`/customer/${docs?.customer?._id}`}>{docs?.customer?.name}</Link>
          </p>
        )}
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
