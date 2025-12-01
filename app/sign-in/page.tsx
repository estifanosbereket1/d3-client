"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useForm } from "react-hook-form"
import { signInType, signInSchema } from "@/components/schema/signin.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter()

  const form = useForm<signInType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  })

  const handleSignIn = form.handleSubmit(async (values) => {
    try {
      const resp = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })


      if (resp.error) {
        toast("Please try again", {

          description: resp.error.message,
          position: "top-right",
          style: {

          }
        })
        return
      }

      toast("Signed in successfully", {
        position: "top-right",
        style: {

        }
      })
      console.log(resp.data)
      console.log(resp.error)


      if (id) {
        router.push(`/accept-invitation/${id}`)
      } else {
        router.push("/select-organization")
      }

    } catch (error) {
      console.log("Sign in error:", error)
    }
  })

  const searchParams = useSearchParams()

  const id = searchParams.get("id")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register("email")}
                required
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                required
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              href={id ? `/sign-up?id=${id}` : "/sign-up"}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
