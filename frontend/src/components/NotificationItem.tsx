import { useDeleteEntity } from "@/utils/QueryFunctions";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Spinner from "./Spinner";
import { usePage } from "@/context/PageProvider";

interface NotificationProps {
  message: string;
  isRead: boolean;
  type: string;
  product: string;
  createdAt: Date;
  _id: string;
}
const NotificationItem = ({ item,  }: { item: NotificationProps;  }) => {
  const { page } = usePage();
  const { deleteEntity, isPending } = useDeleteEntity("notifications", item._id, page);
  return (
    <div
      key={item.message}
      className={` ${
        item.isRead ? "bg-gray-100" : "bg-blue-100 hover:bg-blue-200"
      } duration-150 cursor-pointer w-full max-w-xlg flex flex-col mt-1 gap-4 py-1 px-2 rounded-lg items-center justify-between space-x-4`}
    >
      <div className="text-xs">
        {/* {item.productId &&
        `${item.userId.firstName} ${item.userId.lastName} uploaded a new product ${`(${item.productId.name})`}`} */}
        <br />
        <p className="text-xs">{item.message}</p>
        <div className="flex flex-col items-center">
          {item.product && (
            <Link
              className="text-xs mr-auto text-orange-400 hover:text-orange-500 duration-150 
     hover:underline"
              to={`/products/${item.product}`}
            >
              See it now
            </Link>
          )}
          <div className="flex items-center ml-auto">
            <Button onClick={() => deleteEntity(item._id)} variant={"ghost"}>
              Dismiss
            </Button>
            <span className="text-xs text-gray-400 font-medium">
              {new Date(item.createdAt).toLocaleString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
          {isPending && <Spinner />}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
