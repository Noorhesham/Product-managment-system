import { useAuth } from "@/context/AuthProvider";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "./Spinner";

const PresistLogin = () => {
  const refersh = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refersh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);
  return (
    <div className=" relative min-h-screen w-full">
      {isLoading ? (
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-auto">
          <Spinner />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default PresistLogin;
