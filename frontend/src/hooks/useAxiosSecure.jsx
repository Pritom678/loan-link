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
          try {
            const token = await user.getIdToken(); // <- get Firebase token
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Request with auth token:", config.url);
          } catch (error) {
            console.error("Failed to get Firebase token:", error);
          }
        } else {
          console.log("No user found for request:", config.url);
        }
        return config;
      }
    );

    const responseInterceptor = instance.interceptors.response.use(
      (res) => res,
      async (err) => {
        console.error(
          "API Error:",
          err.response?.status,
          err.response?.data,
          "URL:",
          err.config?.url
        );

        // Don't auto-logout for role-related requests or loan management requests
        // as they might just mean insufficient permissions
        const isRoleRequest =
          err?.config?.url?.includes("/user/role") ||
          err?.config?.url?.includes("-stats") ||
          err?.config?.url?.includes("/loans/");

        if (
          (err?.response?.status === 401 ||
            (err?.response?.status === 403 && !isRoleRequest)) &&
          !isRoleRequest
        ) {
          console.log("Authentication failed, logging out");
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
