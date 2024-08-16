import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Actions from "@/components/Actions";
import { GroupProps } from "@/types";
import { Link } from "react-router-dom";

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
    cell: ({ row }) => {
      return (
        <Link className=" cursor-pointer hover:underline duration-150" to={`/customer/${row.original._id}`}>
          {" "}
          {row.original.name}{" "}
        </Link>
      );
    },
  },

  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },

  //add a sheet
  {
    id: "actions",
    cell: ({ row }) => {
      console.log(row.original);
      return <Actions type="customers" product={row.original} />;
    },
  },
];
