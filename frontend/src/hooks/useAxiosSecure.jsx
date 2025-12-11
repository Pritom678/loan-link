import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "./useAuth";

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [instance] = useState(() =>
    axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
    })
  );

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await user.getIdToken(); // <- get Firebase token
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    const responseInterceptor = instance.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(err);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate, instance]);

  return instance;
};

export default useAxiosSecure;
