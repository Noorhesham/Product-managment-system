import { DataTable } from "@/components/DataTable";
import { useGetEntity } from "@/utils/QueryFunctions";
import { columns } from "./columns";
import Heading from "@/components/Heading";
import { SkeletonTable } from "@/components/SkeletonTable";
import { PageProvider, usePage } from "@/context/PageProvider";
import SellForm from "@/components/SellForm";

const Sells = () => {
  const { page, setTotalPages } = usePage();
  const { data, isLoading } = useGetEntity("sells", page);
  const { data: customers, isLoading: isLoading2 } = useGetEntity("customers", 1, 20);
  const totalPages = data?.data.totalPages;
  setTotalPages(totalPages);
  console.log(data);
  return (
    <div className="bg-white py-2 overflow-hidden relative">
      <div className=" flex items-start justify-between mt-4 px-8">
        <Heading text="Sells" />
        <div className="flex items-center gap-3">
          <SellForm />
        </div>
      </div>
      <div>
        {isLoading || isLoading2 ? (
          <SkeletonTable />
        ) : (
          <DataTable customers={customers?.data.data.docs}  name="sells" columns={columns} data={data?.data.data.docs} />
        )}
      </div>
    </div>
  );
};

const SellsPage = () => {
  return (
    <PageProvider>
      <Sells />
    </PageProvider>
  );
};

export default SellsPage;
