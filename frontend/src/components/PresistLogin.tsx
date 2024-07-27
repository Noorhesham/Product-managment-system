import { useAuth } from "@/context/AuthProvider";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

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
  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>;
};

export default PresistLogin;
