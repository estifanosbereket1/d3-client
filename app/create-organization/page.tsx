"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useForm } from "react-hook-form"
import { organizationSchema, organizationType } from "@/components/schema/organization.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

export default function CreateOrganizationPage() {
  const router = useRouter()

  const form = useForm<organizationType>({
    defaultValues: {
      name: "",
      slug: "",
    },
    resolver: zodResolver(organizationSchema),
  })

  const handleCreateOrg = form.handleSubmit(async (values) => {
    try {
      const resp = await authClient.organization.create({
        name: values.name,
        slug: values.slug,
        keepCurrentActiveOrganization: true,
      })
      if (resp.error) {
        console.log(resp)
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

      router.push("/dashboard/table")
    } catch (e) {
      console.log("Error", e)
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Organization</CardTitle>
          <CardDescription>Set up your first workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrg} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Acme Inc"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="acme-inc"
                {...form.register("slug")}
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Organization"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/join-organization" className="text-primary hover:underline font-medium">
              Join an existing organization instead
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
