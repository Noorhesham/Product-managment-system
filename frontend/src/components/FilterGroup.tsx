import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Spinner from "./Spinner";
import { useGetEntity } from "@/utils/QueryFunctions";
const FilterGroup = ({ table }: { table: any }) => {
  const { data, isLoading } = useGetEntity("groups", 1, 20);
  console.log(data);
  return (
    <div>
      <Select onValueChange={(value) => table.getColumn("group_name")?.setFilterValue(value)}>
        <SelectTrigger className=" min-w-40">
          <SelectValue placeholder="Filter by group" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <Spinner />
          ) : (
            data?.data.data.docs?.map((group: any) => (
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
