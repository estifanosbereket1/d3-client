"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RootPage() {
  const router = useRouter()

  const { data: session, isPending: isLoadingAuth } = authClient.useSession()


  useEffect(() => {
    if (!isLoadingAuth && session) {
      router.replace("/dashboard/table")
      return
    }
    router.replace("/sign-in")
  }, [router, session, isLoadingAuth])

  return null
}
