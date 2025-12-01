"use client";

import axiosClient from "@/api/axios.client";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

// type RequireIdPath<Path> = Path extends `${string}/${string | number}` ? Path : never;
type RequireIdPath<Path extends string> = Path;


export function useApiMutation<TData = unknown, TVariables = any, TError = unknown>(
    path: string,
    method: "post" | "put",
    options?: UseMutationOptions<TData, TError, TVariables>
) {
    return useMutation<TData, TError, TVariables>({
        mutationFn: async (variables) => {
            const res = await axiosClient({ url: path, method, data: variables });
            return res.data;
        },
        ...options,
    });
}

// export function useApiMutationWithId<TData = unknown, TError = unknown>(
//     path: string,
//     method: "patch" | "delete",
//     options?: UseMutationOptions<TData, TError, string | number>
// ) {
//     return useMutation<TData, TError, string | number>({
//         mutationFn: async (id: string | number) => {
//             const url = `${path}/${id}`; // attach id to URL
//             const res = await axiosClient({ url, method });
//             return res.data;
//         },
//         ...options,
//     });
// }
export function useApiMutationWithId<TData = unknown, TError = unknown>(
    path: string,
    method: "patch" | "delete",
    options?: UseMutationOptions<TData, TError, { id: string | number; body?: any }>
) {
    return useMutation<TData, TError, { id: string | number; body?: any }>({
        mutationFn: async ({ id, body }) => {
            const url = `${path}/${id}`;
            const res = await axiosClient({ url, method, data: body });
            return res.data;
        },
        ...options,
    });
}


// export function useApiMutationWithId<TData = unknown, TVariables = any, TError = unknown>(
//     path: RequireIdPath<string>,
//     method: "patch" | "delete",
//     options?: UseMutationOptions<TData, TError, TVariables>
// ) {
//     return useMutation<TData, TError, TVariables>({
//         mutationFn: async (variables) => {
//             const res = await axiosClient({ url: path, method, data: variables });
//             return res.data;
//         },
//         ...options,
//     });
// }
