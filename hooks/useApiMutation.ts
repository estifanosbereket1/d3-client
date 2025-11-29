"use client";

import axiosClient from "@/api/axios.client";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type RequireIdPath<Path> = Path extends `${string}/${string | number}` ? Path : never;

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

export function useApiMutationWithId<TData = unknown, TVariables = any, TError = unknown>(
    path: RequireIdPath<string>,
    method: "patch" | "delete",
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
