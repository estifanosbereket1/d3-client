import z from "zod"

export const organizationSchema = z.object({
    name: z.string(),
    slug: z.string(),
})

export type organizationType = z.infer<typeof organizationSchema>