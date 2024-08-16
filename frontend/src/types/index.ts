export type typeProps = "products" | "groups" | "customers" | "sells" | "purchases" | "debts" | "notifications";

export interface ProductProps {
  group: { _id: string; name: string };
  name: string;
  stock: number;
  subGroups: string[];
  _id: string;
  soldPrice: number;
  purchasePrice: number;
}
export interface GroupProps {
  name: string;
  subgroups: { name: string; options: string[] }[];
  _id: string;
}
export interface CustomerProps {
  name: string;
  phoneNumber: string;
  address: string;
  _id: string;
}
export interface SellProps {
  customer: CustomerProps;
  items: { product: string; sellPrice: number; quantity: number }[];
  _id: string;
  customerPaidTotal: number;
  sellDate: Date;
  isInDept: boolean;
  totalSellPrice: number;
  name: string;
  customerPaidForAllQuantity: number;
  product: any;
}
export interface PurchasesProps {
  items: { product: string; sellPrice: number; quantity: number }[];
  purchaseDate: Date;
  totalPurchasePrice: number;
  name: string;
  _id: string;
  quantity: number;
  purchasePrice: number;
}
export interface DebtsProps {
  deptPrice: number;
  deptDate: Date;
  customer: CustomerProps;
  _id: string;
  name: string;
}
