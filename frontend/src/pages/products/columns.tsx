"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatStock } from "@/components/Stock";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatPrice } from "@/utils/helpers";
import { Checkbox } from "@/components/ui/checkbox";
import Actions from "@/components/Actions";
import { ProductProps } from "@/types";

export const columns: ColumnDef<ProductProps>[] = [
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
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="flex flex-col text-center items-start">Stock: {formatStock(row.original.stock)}</div>;
    },
  },
    {
      accessorKey: "group.name",
      header: "group",
    },
    {
      accessorKey: "subGroups",
      header: "subGroups",
      cell: ({ row }) => {
        return (
          <ul className=" flex items-center flex-wrap gap-2">
            {row.original.subGroups?.filter(Boolean).map((subGroup: string) => (
              <li
                className=" hover:underline hover:text-primary duration-100  cursor-pointer  text-sm bg-gray-200 w-fit py-1 px-2 rounded-2xl "
                key={subGroup}
              >
                {subGroup}
              </li>
            ))}
          </ul>
        );
      },
    },
  {
    accessorKey: "sold",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Sold
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "purchasePrice",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          اجمالي الشراء
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{formatPrice(Number(row.original.purchasePrice))}</p>;
    },
  },
  {
    accessorKey: "soldPrice",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          اجمالي البيع
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{formatPrice(Number(row.original.soldPrice))}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <Actions type="products" product={row.original} />;
    },
  },
];
