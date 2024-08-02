import { DataTable } from "@/components/DataTable";
import { useGetEntity } from "@/utils/QueryFunctions";
import { columns } from "./columns";
import Heading from "@/components/Heading";
import { SkeletonTable } from "@/components/SkeletonTable";
import { PageProvider, usePage } from "@/context/PageProvider";
import Create from "@/components/Create";

import ProductGroup from "@/components/ProductGroup";

const Products = () => {
  const { page, setTotalPages } = usePage();
  const { data, isLoading } = useGetEntity("products", page);
  const totalPages = data?.data.totalPages;
  setTotalPages(totalPages);
  console.log(data);
  return (
    <div className="bg-white py-2 overflow-hidden relative">
      <div className=" flex items-start justify-between mt-4 px-8">
        <Heading text="Products" />
        <div className="flex items-center gap-3">
          <Create page={page} name="product" />
          <ProductGroup />
        </div>
      </div>
      <div>
        {isLoading ? <SkeletonTable /> : <DataTable name="products" columns={columns} data={data?.data.data.docs} />}
      </div>
    </div>
  );
};

const ProductsPage = () => {
  return (
    <PageProvider>
      <Products />
    </PageProvider>
  );
};

export default ProductsPage;
