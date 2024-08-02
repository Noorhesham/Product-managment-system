import axios from "@/api/axios";
import { useAuth } from "@/context/AuthProvider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import CustomForm from "@/components/CustomForm";
import { PageProvider } from "@/context/PageProvider";
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3, { message: "Password must be at least 3 characters" }),
});

const loginArray = [
  {
    name: "email",
    label: "Email",
    placeholder: "Add Your Email...",
    description: "We'll never share your email.",
    id: "title-2",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Add Your Password...",
    description: "We'll never share your password.",
    id: "title-3",
  },
];
const Login = () => {
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from("#welcome", { yPercent: 100, opacity: 0, delay: 0.2 })
      .to("#welcome", { xPercent: 100, rotate: 90, scale: 1.8, duration: 0.8 })
      .to("#intro-slide-img", { xPercent: 100, duration: 0.6 })
      .from("#slide-img", {
        xPercent: 100,
        duration: 0.6,
        delay: 0.1,
      })
      .from(["#title-1", "#title-2", "#title-3"], {
        opacity: 0,
        y: 50,
        stagger: 0.3,
      });
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const { setAuth, auth } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  if (auth?.accessToken) return <Navigate to={from} />;
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    //@ts-ignore
    startTransition(() => {
      axios
        .post(
          "/auth/login",
          {
            email: data.email,
            password: data.password,
          },
          { withCredentials: true }
        )
        .then((response) => {
          setAuth({ accessToken: response.data.token, user: response.data.data.user });
          form.reset();
          navigate(from, { replace: true });
        })
        .catch((error: any) => {
          console.log(error);
          setServerError(error.response?.data?.message || "An error occurred");
        });
    });
  };

  return (
    <PageProvider>
      <section className=" overflow-hidden relative">
        <div id="intro-slide-img" className=" w-full flex items-center justify-center h-full bg-primary z-10 absolute">
          <h1 id="welcome" className=" z-20 text-7xl m-auto text-center text-gray-50 font-bold">
            Weclome
          </h1>
        </div>
        <div className="flex relative overflow-hidden flex-col  min-h-screen mx-auto justify-center  max-w-5xl  ">
          <div className=" py-3 px-6 min-h-64  rounded-2xl bg-gray-50 shadow-sm">
            {/*//@ts-ignore*/}
            <CustomForm
              form={form}
              src="/login.png" isPending={isPending}
              localSubmit={onSubmit}
              inputs={loginArray}
              serverError={serverError}
              title="Hi , Please Login into Your App"
            />
          </div>
        </div>
      </section>
    </PageProvider>
  );
};

export default Login;
