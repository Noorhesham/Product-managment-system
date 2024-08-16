import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Spinner from "./Spinner";
import { useGetEntity } from "@/utils/QueryFunctions";
const FilterGroup = ({ table, customers }: { table: any; customers?: any }) => {
  const { data, isLoading } = useGetEntity("groups", 1, 20);
  const selectData = customers ? customers : data?.data.data.docs;
  console.log(selectData,customers);
  return (
    <div>
      <Select onValueChange={(value) => customers ? table.getColumn("customer_name")?.setFilterValue(value) : table.getColumn("group_name")?.setFilterValue(value)}>
        <SelectTrigger className=" min-w-40">
          <SelectValue placeholder="Filter by group" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <Spinner />
          ) : (
            selectData?.map((group: any) => (
              <SelectItem key={group._id} value={group.name}>
                {group.name}
              </SelectItem>
            ))
          )}
          {/**@ts-ignore */}
          <SelectItem value={undefined}>All</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterGroup;
