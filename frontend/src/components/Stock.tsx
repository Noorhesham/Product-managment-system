import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
export function formatStock(quantity: number): React.ReactElement {
  let icon;
  let styleClass;

  if (quantity > 8) {
    icon = <FaCheckCircle className="text-green-500" />;
    styleClass = "text-green-700 font-bold";
  } else if (quantity > 0) {
    icon = <FaExclamationCircle className="text-yellow-500" />;
    styleClass = "text-yellow-700 font-bold";
  } else {
    icon = <FaTimesCircle className="text-red-500" />;
    styleClass = "text-red-700 font-bold";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center   ${styleClass}`}>
            {icon}
            <span className="ml-1">{quantity}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p> {quantity>0&&quantity<=8?"Low Stock":quantity>8 ? "In Stock" : "Out of Stock"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
