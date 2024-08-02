import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ icon, text, href }: { text: string; icon: ReactNode; href: string }) => {
  const { pathname } = useLocation();
  return (
    <Link className="  flex  items-center gap-2 " to={href}>
      <Button
        variant={pathname.slice(1) === href ? "default" : "outline"}
        className={`flex hover:bg-primary  py-6  flex-grow justify-start hover:text-gray-50 items-center gap-2`}
      >
        {icon} {text}
      </Button>
    </Link>
  );
};

export default NavLink;
