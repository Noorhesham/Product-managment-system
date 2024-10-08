import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ icon, text, href, count }: { text: string; icon: ReactNode; href: string; count?: number }) => {
  const { pathname } = useLocation();
  return (
    <Link className="  flex  items-center gap-2 " to={href}>
      <Button
        variant={pathname.slice(1) === href ? "default" : "outline"}
        className={`flex hover:bg-primary  py-6  flex-grow justify-start hover:text-gray-50 items-center gap-2`}
      >
        {icon} {text}
        {count !== 0 && (
          <span className="text-xs  w-5 text-center flex items-center justify-center h-5 rounded-full ml-auto bg-sky-400 text-gray-800">
            {count}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default NavLink;
