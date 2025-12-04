"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { authClient } from "@/lib/auth-client"
import { useForm } from "react-hook-form"
import { organizationSchema, organizationType } from "@/components/schema/organization.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { LogoUploader } from "@/components/logo.uploader"
import { Pencil } from "lucide-react"

interface Props {
    org: {
        id: string
        name: string
        slug: string
        logo?: string | null
    }
}

export default function UpdateOrganizationModal({ org }: Props) {
    const [imageUrl, setImageUrl] = useState<string | undefined>(org.logo || "")
    const [open, setOpen] = useState(false)

    const form = useForm<organizationType>({
        defaultValues: {
            name: org.name,
            slug: org.slug,
        },
        resolver: zodResolver(organizationSchema),
    })

    const handleUpdate = form.handleSubmit(async (values) => {
        try {
            const { data: slugCheck, error: slugError } = await authClient.organization.checkSlug({
                slug: values.slug, // required
            });

            if (!slugError) {
                if (slugCheck) {
                    toast("Slug already exists", {
                        position: "top-right"
                    })
                    return
                }
            }
            const { data, error } = await authClient.organization.update({
                data: { // required
                    name: values.name,
                    slug: values.slug,
                    logo: imageUrl,
                },
                organizationId: org.id,
            });
            if (!error) {

                toast("Organization updated successfully", {
                    position: "top-right"
                })
            }
            setOpen(false)
        } catch (e) {
            toast("Failed ", {
                position: "top-right"
            })
            console.log("Error updating organization", e)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Edit Organization">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle>Update Organization</DialogTitle>
                    <DialogDescription>Edit your organization details</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdate} className="space-y-6 px-4 py-2">
                    {/* Logo Uploader centered */}
                    <div className="flex justify-center mb-4">
                        <img src={imageUrl} alt="" className="w-16 h-16 rounded-full" />
                        {/* <LogoUploader
                            // imageUrl={imageUrl} 
                            imageUrl=""
                            onUploadSuccess={(url) => setImageUrl(url)} /> */}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Organization Name</Label>
                        <Input id="name" {...form.register("name")} />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" {...form.register("slug")} />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Updating..." : "Update Organization"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
