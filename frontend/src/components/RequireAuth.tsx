import { useAuth } from "@/context/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SideBar } from "./SideBar";

const RequireAuth = () => {
  const location = useLocation();
  const { auth } = useAuth();

  if (!auth?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <main className="grid w-full min-h-screen grid-cols-10">
      <div className="col-span-2">
        <SideBar />
      </div>
      <div className="bg-gray-100 col-span-8">
        <Outlet />
      </div>
    </main>
  );
};

export default RequireAuth;
