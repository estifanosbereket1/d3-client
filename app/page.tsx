"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RootPage() {
  const router = useRouter()

  const { data: session, isPending: isLoadingAuth } = authClient.useSession()


  useEffect(() => {
    if (!isLoadingAuth && session) {
      router.push("/dashboard/table")
      return
    }
    router.push("/sign-in")
  }, [router, session, isLoadingAuth])

  return null
}
