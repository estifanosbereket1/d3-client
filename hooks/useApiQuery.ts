"use client";

import axiosClient from "@/api/axios.client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useApiQuery<TData = unknown, TError = unknown>(
    key: any[],
    path: string,
    options?: UseQueryOptions<TData, TError>
) {
    return useQuery<TData, TError>({
        queryKey: key,
        queryFn: async () => {
            const res = await axiosClient.get(path);
            return res.data;
        },
        ...options,
    });
}
