import axios from "@/api/axios";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthProvider";
import { Link } from "react-router-dom";
import useLogout from "@/hooks/useLogout";

const Login = () => {
  const { setAuth, auth } = useAuth();
  const logout=useLogout()
  return (
    <div className="flex flex-col   ">
      <Button className=" ">fa</Button>
      {!auth?.accessToken&&<button
        onClick={async () => {
          const response = await axios.post("/auth/login", {
            email: "noordragon2004@gmail.com",
            password: "1234",
          },{withCredentials: true});
          setAuth({ accessToken: response.data.token });
          console.log(auth);
          console.log(response.data);
        }}
      >
        login
      </button>}
     {auth?.accessToken&& <Button onClick={()=>logout()} variant={"destructive"}> logout</Button>}
      <Link to="/products">register</Link>
    </div>
  );
};

export default Login;
