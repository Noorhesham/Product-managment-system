import CardCustom from "@/components/Card";
import { DataTable } from "@/components/DataTable";
import Section from "@/components/Section";
import Spinner from "@/components/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchasesProps, SellProps } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { useGetProduct } from "@/utils/QueryFunctions";
import { useParams } from "react-router-dom";
import { columns } from "./sells/columns";
import { columns as columns2 } from "./purchase/columns";
import { PageProvider, usePage } from "@/context/PageProvider";
import { useEffect, useState } from "react";
import { PiechartCustom } from "@/components/PieChart";

const ProductDetails = () => {
  const { page, setTotalPages } = usePage();
  const { id } = useParams();
  const { data, isLoading } = useGetProduct(id || "", page);
  const [tab, setTab] = useState("sells");

  useEffect(() => {
    setTotalPages(data?.data.data.pagination.totalPagesSells);
  }, [isLoading]);
  if (isLoading)
    return (
      <div className=" h-full min-h-screen w-full m-auto flex items-center justify-center">
        <Spinner />
      </div>
    );
  const sells = data?.data.data.sellsForProduct;
  const sellData = sells.map((sell: SellProps) => {
    return {
      name: sell.customer.name,
      sellDate: sell.sellDate,
      //@ts-ignore
      ...sell.items.filter((item) => item.product._id === id)[0],
      isInDept: sell.isInDept,
      id: sell._id,
      //@ts-ignore
      product: sell.product,
    };
  });
  const purchases = data?.data.data.purchasesForProduct;
  const product = data?.data.data.product;
  const purchaseData = purchases.map((purchase: PurchasesProps) => {
    return {
      purchaseDate: purchase.purchaseDate,
      //@ts-ignore
      ...purchase.items.filter((item) => item.product._id === id)[0],
      id: purchase._id,
      //@ts-ignore
      product: purchase.product,
      totalPurchasePrice: purchase.totalPurchasePrice,
    };
  });
  const pieChartData = tab === "sells" ? sellData : purchaseData;
  return (
    <Section header={data?.data.data.product.name + " Details"}>
      <div className=" grid gap-3 grid-cols-7 w-full">
        <CardCustom img="/sell.png" text="Product Total Sells" header={formatPrice(product.soldPrice)} />
        <CardCustom img="/sell.png" text="Product Total Sells" header={formatPrice(product.purchasePrice)} />
        <div className=" col-span-3">
          <PiechartCustom data={pieChartData} />
        </div>
      </div>
      <Tabs onValueChange={setTab} defaultValue="sells" className="w-full">
        <TabsList className=" mt-5 w-full">
          <TabsTrigger
            onClick={() => setTotalPages(data?.data.data.pagination.totalPagesSells)}
            className=" flex-1"
            value="sells"
          >
            Sells For This Product
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setTotalPages(data?.data.data.pagination.totalPagesPurchases)}
            className=" flex-1"
            value="purchases"
          >
            purchases
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sells">
          <DataTable name="sells" filter={true} columns={columns} data={sellData} />
        </TabsContent>
        <TabsContent value="purchases">
          <DataTable name="purchases" filter={true} columns={columns2} data={purchaseData} />
        </TabsContent>
      </Tabs>
    </Section>
  );
};
const ProductDetailsPage = () => {
  return <PageProvider>{<ProductDetails />}</PageProvider>;
};
export default ProductDetailsPage;
