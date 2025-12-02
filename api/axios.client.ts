import { store } from "@/store";
import axios from "axios";

const axiosClient = axios.create({
    withCredentials: true,
    baseURL: process.env.NEXT_PUBLIC_ENVIRONMENT == "development" ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_PRODUCTION_URL,

});

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

axiosClient.interceptors.response.use(
    (response: any) => response,
    (error: any) => Promise.reject(error)
);

export default axiosClient;


// import { authClient } from "@/lib/auth-client";
// import { store } from "@/store";
// import axios from "axios";

// const axiosClient = axios.create({
//     withCredentials: true,
//     baseURL: process.env.NEXT_PUBLIC_ENVIRONMENT == "development" ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_PRODUCTION_URL,
// });

// axiosClient.interceptors.request.use(
//     async (config: any) => {
//         const state = store.getState();
//         const orgId = state.organization?.id;
//         const { data } = await authClient.getSession()

//         // Get Better Auth session cookie
//         const sessionCookie = document.cookie
//             .split('; ')
//             .find(row => row.startsWith('better-auth.session_token='));

//         console.log("sesionnnn", sessionCookie)

//         if (sessionCookie) {
//             config.headers = {
//                 ...(config.headers || {}),
//                 "Cookie": data,
//             };
//         }

//         if (orgId) {
//             config.headers = {
//                 ...(config.headers || {}),
//                 "x-organization-id": orgId,
//             };
//         }

//         return config;
//     },
//     (error: any) => Promise.reject(error)
// );

// export default axiosClient;