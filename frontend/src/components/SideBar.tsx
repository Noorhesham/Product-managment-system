import { AiFillProduct } from "react-icons/ai";
import NavLink from "./NavLink";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { MdOutlineSell, MdProductionQuantityLimits } from "react-icons/md";
import { TbCreditCardPay } from "react-icons/tb";
import { BiNotification } from "react-icons/bi";
import Logo from "./Logo";

export const SideBar = () => {
  return (
    <div className=" py-5  px-5">
      <div className="">
        <div className=" mb-5">
          <Logo />
        </div>
        <ul className=" flex flex-grow items-stretch  flex-col  gap-3">
          <h2 className=" font-semibold">Menu</h2>
          <NavLink href="products" icon={<AiFillProduct />} text="Inventory" />
          <NavLink href="groups" icon={<MdProductionQuantityLimits />} text="Product Groups" />
          <NavLink href="customers" icon={<FaPeopleCarryBox />} text="Customers" />
          <NavLink href="sells" icon={<MdOutlineSell />} text="Sells" />
          <NavLink href="purchases" icon={<TbCreditCardPay />} text="Purchases" />
          <NavLink href="notifications" icon={<BiNotification />} text="Alerts" />
        </ul>
      </div>
    </div>
  );
};
