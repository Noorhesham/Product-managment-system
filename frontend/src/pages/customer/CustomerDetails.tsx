import CardCustom from "@/components/Card";
import { DataTable } from "@/components/DataTable";
import Section from "@/components/Section";
import Spinner from "@/components/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/utils/helpers";
import { useGetEntity } from "@/utils/QueryFunctions";
import { useParams } from "react-router-dom";

import { PageProvider, usePage } from "@/context/PageProvider";
import { useEffect, useState } from "react";
import { columns } from "../Sell/columns";
import { columns as columns2 } from "../debts/columns";

const CustomerDetails = () => {
  const { page, setTotalPages } = usePage();
  const { id } = useParams();
  const { data, isLoading } = useGetEntity("sells", page, 10, "customer", id);
  const { data: data2, isLoading: isLoading2 } = useGetEntity("debts", page, 10, "customer", id);
  const [tab, setTab] = useState("sells");

  useEffect(() => {
    setTotalPages(data2?.data.totalPages);
  }, [isLoading, isLoading2]);
  if (isLoading || isLoading2)
    return (
      <div className=" h-full min-h-screen w-full m-auto flex items-center justify-center">
        <Spinner />
      </div>
    );
  const sells = data?.data.data.docs;

  const debts = data2?.data.data.docs;

  const totalDepts = debts.reduce((acc: number, curr: any) => acc + curr.deptPrice, 0);
  const totalPurchasesForCustomer = sells.reduce((acc: number, curr: any) => acc + curr.customerPaidTotal, 0);
  return (
    <Section header="Customer Details">
      <div className=" grid gap-3 grid-cols-7 w-full">
        <CardCustom img="/sell.png" text="Customer Total Purchases" header={formatPrice(totalPurchasesForCustomer)} />
        <CardCustom img="/sell.png" text="Customer Total debts" header={formatPrice(totalDepts)} />
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
            value="debts"
          >
            debts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sells">
          <DataTable name="sells" filter={true} columns={columns} data={sells} />
        </TabsContent>
        <TabsContent value="debts">
          <DataTable name="debts" filter={true} columns={columns2} data={debts} />
        </TabsContent>
      </Tabs>
    </Section>
  );
};
const CustomerDetailsPage = () => {
  return <PageProvider>{<CustomerDetails />}</PageProvider>;
};
export default CustomerDetailsPage;
