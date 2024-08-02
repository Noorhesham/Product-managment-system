import { PenIcon } from "lucide-react";
import { Button } from "./ui/button";

const EditButton = ({ text }: { text: string }) => {
  return (
    <Button
      variant="ghost"
      className=" mt-3 gap-2 w-full flex hover:text-green-400 hover:underline duration-100 items-center   text-left"
    >
      {text}
      <PenIcon className="ml-2 text-green-200 h-4 w-4" />
    </Button>
  );
};

export default EditButton;
