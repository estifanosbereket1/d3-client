"use client"

import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function CreateOrganizationLayout({ children }: { children: ReactNode }) {
    const { data, isPending, isRefetching } = authClient.useSession()

    // if (!isPending && !isRefetching) {
    //     if (!data) {
    //         redirect("/sign-in");
    //     }
    // }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            {children}
        </div>
    )
}
