"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, Container, Zap, Cloud, Code, MailIcon, Database } from "lucide-react"
import { IconBrandDocker, IconBrandNextjs, IconBrandNodejs, IconBrandPrisma, IconBrandVercel } from "@tabler/icons-react"

interface TechStackItem {
    name: string
    icon: React.ReactNode
    description: string
}

export default function DocsPage() {
    const techStack: TechStackItem[] = [
        {
            name: "Next.js",
            icon: <IconBrandNextjs className="w-8 h-8" />,
            description: "React framework for production",
        },
        {
            name: "NestJS",
            icon: <IconBrandNodejs className="w-8 h-8" />,
            description: "Progressive Node.js framework",
        },
        {
            name: "Better Auth",
            icon: <Shield className="w-8 h-8" />,
            description: "Modern authentication for web",
        },
        {
            name: "Docker",
            icon: <IconBrandDocker className="w-8 h-8" />,
            description: "Containerization platform",
        },
        {
            name: "Vercel",
            icon: <IconBrandVercel className="w-8 h-8" />,
            description: "Deployment and hosting",
        },
        {
            name: "PostgreSQL",
            icon: <Database className="w-8 h-8" />,
            description: "Relational database",
        },
        {
            name: "Prisma",
            icon: <IconBrandPrisma />,
            description: "ORM for databases"
        },

        {
            name: "NeonDv",
            icon: <Database />,
            description: "Databse provider for postgres"
        },

        {
            name: "Resend",
            icon: <MailIcon className="w-8 h-8" />,
            description: "Email service"
        }
    ]

    const docLinks = [
        {
            title: "Authentication Docs",
            description: "Documentation for Better Auth",
            url: "http://d3.beete-nibab.com/api/v1/auth/refrences",
        },
        {
            title: "Outline Docs",
            description: "Documentation for outline management system",
            url: "http://d3.beete-nibab.com/api",
        },
    ]

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
                <div>
                    <h1 className="text-3xl font-bold">Documentation</h1>
                    <p className="text-sm text-muted-foreground mt-1">Tech stack and tools reference</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                    {/* Tech Stack Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {techStack.map((tech) => (
                                <Card key={tech.name} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="text-primary mb-3">{tech.icon}</div>
                                        <h3 className="font-semibold text-lg">{tech.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-2">{tech.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Documentation Links Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Documentation Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {docLinks.map((doc) => (
                                <Card key={doc.title}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{doc.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                                        <Button
                                            variant="outline"
                                            className="w-full bg-transparent"
                                            disabled={!doc.url}
                                            onClick={() => doc.url && window.open(doc.url, "_blank")}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View Docs
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
