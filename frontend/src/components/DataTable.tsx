import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  VisibilityState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./Pagination";
import { useState } from "react";

import { AiFillCloseCircle } from "react-icons/ai";

import FilterGroup from "./FilterGroup";
import PopUp from "./PopUp";
import { useDeleteEntity } from "@/utils/QueryFunctions";
import { typeProps } from "@/types";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter?: boolean;
  name: typeProps;
  customers?: any[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  name,
  filter = false,
  customers,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });
  //@ts-ignore
  const chosen = table?.getSelectedRowModel().flatRows.map((row) => row.original?._id);
  const { deleteEntity, isPending } = useDeleteEntity(name);
  const handleDeleteAll = (data: any) => {
    data.map((item: any) => deleteEntity(item));
    table.resetRowSelection();
  };

  return (
    <div className="rounded-md  py-2.5 px-5">
      {chosen.length > 0 && (
        <PopUp isPending={isPending} count={chosen.length} handleDelete={() => handleDeleteAll(chosen)} />
      )}
      {!filter && (
        <div className="flex  justify-between  relative items-center py-4">
          <div className=" flex relative  w-[30%]  items-center gap-2">
            <Input
              placeholder="Filter names..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            {(table.getColumn("name")?.getFilterValue() as string) !== "" && (
              <button
                onClick={() => table.getColumn("name")?.setFilterValue(undefined)}
                className=" p-1 absolute right-0 top-1/2 -translate-y-1/2 rounded-full text-gray-400 hover:text-gray-600"
              >
                <AiFillCloseCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          <FilterGroup customers={customers} table={table} />
        </div>
      )}
      <Table className=" bg-white">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className=" text-left" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
