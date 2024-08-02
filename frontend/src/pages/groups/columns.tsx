import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Actions from "@/components/Actions";
import { GroupProps } from "@/types";

export const columns: ColumnDef<GroupProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "subGroups",
    header: "subGroups",
    cell: ({ row }) => {
      return (
        <ul className=" flex items-center flex-wrap gap-2">
          {row.original.subgroups?.map((subGroup: any) => (
            <li
              className=" hover:underline hover:text-primary duration-100  cursor-pointer  text-sm bg-gray-200 w-fit py-1 px-2 rounded-2xl "
              key={subGroup._id}
            >
              {subGroup.name}
            </li>
          ))}
        </ul>
      );
    },
  },
  //add a sheet
  {
    id: "actions",
    cell: ({ row }) => {
      console.log(row.original);
      return <Actions type="groups" product={row.original} />;
    },
  },
];
