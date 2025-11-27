"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [orgName, setOrgName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="flex h-screen">
      <Sidebar orgName={orgName} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
