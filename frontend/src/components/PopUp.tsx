import { Delete } from "./Delete";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Spinner from "./Spinner";
const PopUp = ({ count, handleDelete,isPending }: { count: number; handleDelete: Function,isPending:boolean }) => {
    useGSAP(()=>{
        gsap.from(".pop-up",{opacity:0,y:50,duration:0.2,ease:"ease-in"})
    })
  return (
    <div
      className="pop-up py-3 px-6 rounded-full fixed  hover:bg-rose-500 duration-200 cursor-pointer font-medium bg-rose-400  left-[60%] -translate-x-1/2 bottom-6 text-gray-50 z-50  flex items-center gap-5 "
    >
      <p>Delete All Elements ?</p>
      <span>{count} Selected</span>
      <Delete onClick={handleDelete} value={"Delete"} />
      {isPending&&<Spinner/>}
    </div>
  );
};

export default PopUp;
