import z from "zod"


export enum SectionStyle {
    TableOfContents = "TableOfContents",
    ExecutiveSummary = "ExecutiveSummary",
    TechnicalApproach = "TechnicalApproach",
    Design = "Design",
    FocusDocument = "FocusDocument",
    Capabilities = "Capabilities",
    Narrative = "Narrative",
}

export enum Status {
    Pending = "Pending",
    InProgress = "In-Progress",
    Completed = "Completed",
}


export const outlineSchema = z.object({
    header: z.string(),
    section: z.nativeEnum(SectionStyle),
    status: z.nativeEnum(Status),
    limit: z.number(),
    target: z.number(),
    memberId: z.string()
})

export type outlineType = z.infer<typeof outlineSchema>

