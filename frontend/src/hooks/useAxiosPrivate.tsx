import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "@/context/AuthProvider";
import { axiosPrivate } from "@/api/axios";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken(); //بحيب الفانكشن الي بتعمل ريفرش للتوكين
  const { auth } = useAuth(); //بجيب الاكسيس توكن  global state (saved in the app memory in a context)
  useEffect(() => {
    //الايفكت ده هيشتغل اول ما الابلكيشن يحمل ولو حالة الاكسيس توكن اتغيرت

    // هنا بكل بساطه اكني بقول لاكسيوس مع كل ريكوست تعمله ابعت الهيدرز ويكون فيها الاكسيس توكين
  
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error) // لو في ايرور ارفض العملية
    );
    // هنا بقول لاكسيوس يبص علي نتيجة رد السيرفر او الريسبونس 

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,// if the request was success just return the response
      async (error) => {
        //what if there is an error !! حان وقت العمل 
        console.log(error)
        // هجيب الريكوست الي عملتها عشان يجيلي الريسبونس ده (الريكوست الي فشل)
        const prevRequest = error?.config;
        // if the access token expired
        //  هشوف الايرور كود المرتبط بانتهاء صلاحية الاكسيس توكن عندي في السيرفر واتشيك عليه هنا و اتاكد ان الريكوست فعلا موصلش
        if (error?.response?.status === 500 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh(); //بجيب اكسيس توكين جديد بالريفرش توكن  function
          // بعمل ابديت للريكوست بالاكسيس الجديد و ابعتها تاني 
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept); //cleaining up
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [auth, refresh]);
  return axiosPrivate;
};

export default useAxiosPrivate;
