import { DataTable } from "@/components/DataTable";
import { SkeletonTable } from "@/components/SkeletonTable";
import { PageProvider, usePage } from "@/context/PageProvider";
import { useGetEntity } from "@/utils/QueryFunctions";
import { columns } from "./columns";
import Heading from "@/components/Heading";

const Debts = () => {
  const { page, setTotalPages } = usePage();
  const { data: data2, isLoading: isLoading2 } = useGetEntity("customers", 1, 20);

  const { data, isLoading } = useGetEntity("debts", page);
  const totalPages = data?.data.totalPages;
  setTotalPages(totalPages);
  console.log(data2);
  return (
    <div className="bg-white py-2 overflow-hidden relative">
      <div className=" flex items-start justify-between mt-4 px-8">
        <Heading text="Debts" />
      </div>
      <div>
        {isLoading||isLoading2 ? (
          <SkeletonTable />
        ) : (
          <DataTable customers={data2?.data.data.docs} name="debts" columns={columns} data={data?.data.data.docs} />
        )}
      </div>
    </div>
  );
};

const DebtsPage = () => {
  return (
    <PageProvider>
      <Debts />
    </PageProvider>
  );
};

export default DebtsPage;
