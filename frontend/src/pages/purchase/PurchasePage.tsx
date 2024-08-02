import { DataTable } from "@/components/DataTable";
import { useGetEntity } from "@/utils/QueryFunctions";
import { columns } from "./columns";
import Heading from "@/components/Heading";
import { SkeletonTable } from "@/components/SkeletonTable";
import { PageProvider, usePage } from "@/context/PageProvider";
import PurchaseForm from "@/components/PurchaseForm";

const Purchases = () => {
  const { page, setTotalPages } = usePage();
  const { data, isLoading } = useGetEntity("purchases", page);
  const totalPages = data?.data.totalPages;
  setTotalPages(totalPages);
  console.log(data);
  return (
    <div className="bg-white py-2 overflow-hidden relative">
      <div className=" flex items-start justify-between mt-4 px-8">
        <Heading text="Purchases" />
        <div className="flex items-center gap-3">
          <PurchaseForm  />
        </div>
      </div>
      <div>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable filter name="purchases" columns={columns} data={data?.data.data.purchases} />
        )}
      </div>
    </div>
  );
};

const PurchasesPage = () => {
  return (
    <PageProvider>
      <Purchases />
    </PageProvider>
  );
};

export default PurchasesPage;
