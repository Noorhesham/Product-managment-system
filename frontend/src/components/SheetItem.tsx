import { ProductProps, PurchasesProps, SellProps, typeProps } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { Link } from "react-router-dom";

const SheetItem = ({ item, wholeItem, type }: { item: ProductProps; wholeItem: PurchasesProps&SellProps; type: typeProps }) => {
  console.log(item, wholeItem);
  return (
    <div>
      <div className=" space-y-3 py-2">
        <div className="flex items-start justify-between gap-4">
          <div className=" flex items-center space-x-4">
            <div className="flex flex-col self-start">
              <Link
                to={`/product/${item._id}`}
                className=" hover:text-amber-400 hover:underline duration-150 line-clamp-1 text-sm font-medium mb-1"
              >
                {item.name}
              </Link>{" "}
              <p className=" hover:text-amber-400 hover:underline duration-150 line-clamp-1 text-sm capitalize text-muted-foreground ">
                {item.group?.name}
              </p>
            </div>
          </div>
          {type === "purchases" && (
            <div className="flex flex-col  space-y-1 font-medium">
              <span className=" ml-auto line-clamp-1 text-sm">
                {" "}
                <div className=" ml-auto font-medium text-gray-900">
                  <p className="flex items-center gap-1 flex-col">
                    <span className=" text-gray-900 ">
                      {" "}
                      {formatPrice(wholeItem.purchasePrice)} per {wholeItem.quantity} unit{" "}
                    </span>
                    <span>With total of {formatPrice(wholeItem.purchasePrice * wholeItem.quantity)}</span>
                  </p>
                </div>
              </span>
            </div>
          )}
          {type === "sells" && (
            <div className="flex flex-col  space-y-1 font-medium">
              <span className=" ml-auto line-clamp-1 text-sm">
                {" "}
                <div className=" ml-auto font-medium text-gray-900">
                  <p className="flex items-center gap-1 flex-col">
                    <span className=" text-gray-900 ">
                      customer paid {" "}
                      {formatPrice(wholeItem.customerPaidForAllQuantity)} per {wholeItem.quantity} unit{" "}
                    </span>
                   {wholeItem.isInDept&& <span>so customer is in dept</span>}
                  </p>
                </div>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SheetItem;
