import { DataTable } from "@/components/DataTable";
import { SkeletonTable } from "@/components/SkeletonTable";
import { PageProvider, usePage } from "@/context/PageProvider";
import { useGetEntity } from "@/utils/QueryFunctions";
import { columns } from "./columns";
import Heading from "@/components/Heading";
import CustomerForm from "@/components/CustomerForm";

const Customers = () => {
  const { page, setTotalPages } = usePage();
  const { data, isLoading } = useGetEntity("customers", page);
  const totalPages = data?.data.totalPages;
  setTotalPages(totalPages);
  return (
    <div className="bg-white py-2 overflow-hidden relative">
      <div className=" flex items-start justify-between mt-4 px-8">
        <Heading text="Customers" />
        <div className="flex items-center gap-3">
          <CustomerForm />
        </div>
      </div>
      <div>
        {isLoading ? <SkeletonTable /> : <DataTable name="customers" columns={columns} data={data?.data.data.docs} />}
      </div>
    </div>
  );
};

const CustomersPage = () => {
  return (
    <PageProvider>
      <Customers />
    </PageProvider>
  );
};

export default CustomersPage;
