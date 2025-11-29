import { SectionStyle, Status } from "@/components/schema/outline.schema"
import { ZodNumberFormat } from "better-auth"

export interface Outline {
    id: string
    header: string,
    status: Status,
    section: SectionStyle,
    limit: number,
    target: number,
    reviewerId: string
    reviewer: string
}


export type OutlineResponse = Outline[];
