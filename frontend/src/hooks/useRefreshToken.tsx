import { useAuth } from "../context/AuthProvider";
import { axiosPrivate } from "@/api/axios";
//this function makes a request to get the refresh token and set it in the state 
const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const res = await axiosPrivate.get("/auth/refresh", {
      withCredentials: true, //send the refresh token cookie
    });//@ts-ignore
    setAuth((prev: { accessToken: string, user: { name: string } }) => {
      console.log(JSON.stringify(prev));
      console.log(res);
      return { ...prev, accessToken: res.data.token , user: res.data.data.user };
    });
    return res.data.token;
  };
  return refresh;
};

export default useRefreshToken;
