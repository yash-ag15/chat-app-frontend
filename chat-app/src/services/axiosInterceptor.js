import axios from "axios";
import { toast } from "react-toastify";

let hasHandledUnauthorized = false;

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const token = localStorage.getItem("token");
     

      if (status === 401 && token  && !hasHandledUnauthorized) {
        hasHandledUnauthorized = true;

        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.", {
          toastId: "session-expired",
        });

        if (window.location.pathname !== "/auth") {
          window.location.assign("/auth");
        }

        setTimeout(() => {
          hasHandledUnauthorized = false;
        }, 1000);
      }

      return Promise.reject(error);
    }
  );
};
