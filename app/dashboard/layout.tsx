"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { authClient } from "@/lib/auth-client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { data, isPending, isRefetching } = authClient.useSession();

  console.log(data, "in lay")

  // if (!isPending && !isRefetching) {
  //   if (!data) {
  //     redirect("/sign-in");
  //   }
  // }
  const router = useRouter()
  const [orgName, setOrgName] = useState("")

  return (
    <div className="flex h-screen">
      <Sidebar orgName={orgName} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
