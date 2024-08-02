import { DataTable } from "@/components/DataTable";
import Heading from "@/components/Heading";
import ProductGroup from "@/components/ProductGroup";
import { SkeletonTable } from "@/components/SkeletonTable";
import { PageProvider, usePage } from "@/context/PageProvider";
import { columns } from "./columns";
import { useGetEntity } from "@/utils/QueryFunctions";

const ProductGroups = () => {
  const { page, setTotalPages } = usePage();
  const { data, isLoading } = useGetEntity("groups", page);
  const totalPages = data?.data.totalPages;
  setTotalPages(totalPages);
  console.log(data);
  return (
    <div className="bg-white py-2 overflow-hidden relative">
      <div className=" flex items-start justify-between mt-4 px-8">
        <Heading text="Products" />
        <div className="flex items-center gap-3">
          <ProductGroup />
        </div>
      </div>
      <div>{isLoading ? <SkeletonTable /> : <DataTable  name="groups" columns={columns} data={data?.data?.data?.docs} />}</div>
    </div>
  );
};

const ProductsPage = () => {
  return (
    <PageProvider>
      <ProductGroups />
    </PageProvider>
  );
};

export default ProductsPage;
