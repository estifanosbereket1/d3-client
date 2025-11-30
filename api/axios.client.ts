// src/api/axiosClient.ts
import { store } from "@/store";
import axios from "axios";
// import store from "../store";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
    (config: any) => {
        const state = store.getState();
        const orgId = state.organization?.id;
        if (orgId) {
            config.headers = {
                ...(config.headers || {}),
                "x-organization-id": orgId,
            };
        }

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
