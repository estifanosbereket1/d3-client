// src/api/axiosClient.ts
import axios from "axios";
// import store from "../store";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
    (config: any) => {
        const session = localStorage.getItem("session")

        // const state = store.getState();
        // const accessToken = state.auth?.accessToken;
        // const organizationId = state.org?.organizationId;



        // if (organizationId) {
        //     config.headers["x-organization-id"] = organizationId;
        // }

        return config;
    },
    (error: any) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
    (response: any) => response,
    (error: any) => Promise.reject(error)
);

export default axiosClient;
