"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useForm } from "react-hook-form"
import { outlineSchema, outlineType } from "./schema/outline.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Outline } from "@/interfaces/outline.interface"
import { authClient } from "@/lib/auth-client"

interface OutlineItem {
  id: string
  header: string
  sectionType: string
  status: "In Progress" | "Done" | "Not Started"
  target: number
  limit: number
  reviewer: string
}

interface OutlineSheetProps {
  item?: Outline
  // onSave: (item: Outline) => void
  trigger?: React.ReactNode
}

const SECTION_TYPE_OPTIONS = [
  "TableOfContents",
  "ExecutiveSummary",
  "TechnicalApproach",
  "Design",
  "FocusDocument",
  "Capabilities",
  "Narrative",
]

const STATUS_OPTIONS = ["Not Started", "In Progress", "Done"]

const chartData = [
  { month: "Jan", Mobile: 100, Desktop: 150 },
  { month: "Feb", Mobile: 120, Desktop: 170 },
  { month: "Mar", Mobile: 110, Desktop: 180 },
  { month: "Apr", Mobile: 130, Desktop: 200 },
  { month: "May", Mobile: 130, Desktop: 209 },
]

export function OutlineSheet({ item, trigger }: OutlineSheetProps) {
  const [open, setOpen] = useState(false)


  const form = useForm<outlineType>({
    defaultValues: {
      header: "",
      reviewer: "",
    },
    resolver: zodResolver(outlineSchema)
  })

  const { data: activeOrg } = authClient.useActiveOrganization()

  const handleCreateOutline = form.handleSubmit(async (values) => {
    try {
      console.log(values)
    } catch (e) { }
  })

  useEffect(() => {
    if (item) {
      form.setValue("header", item.header)
      form.setValue("section", item.section)
      form.setValue("status", item.status)
      form.setValue("target", item.target)
      form.setValue("limit", item.limit)
      form.setValue("reviewer", item.reviewerId)
    }
  }, [item])



  const handleSubmit = () => {
    // onSave(formData)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger || <Button variant="outline">Edit</Button>}</SheetTrigger>

      {/* SheetContent: right drawer with max width similar to your screenshots */}
      <SheetContent
        className="w-full sm:max-w-md lg:max-w-sm h-full overflow-y-auto p-6 bg-white"
        side="right"
      >
        {/* Chart card */}
        <div className="mb-6">
          <div className="rounded-lg bg-white shadow-md border border-gray-100 overflow-hidden">
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* minimal grid */}
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={24} />
                  <Area
                    type="monotone"
                    dataKey="Mobile"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorMobile)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Desktop"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorDesktop)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* small stat bar under chart to mimic your design */}
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="h-2 rounded-md bg-gray-200 w-full" />
            </div>
          </div>
        </div>

        {/* Title + description */}
        <div className="mb-5">
          <h3 className="text-xl font-semibold mb-1 text-gray-900">{item?.header || "Cover page"}</h3>
          <p className="text-xs text-gray-500 mb-2">Showing total visitors for the last 6 months</p>
          <p className="text-sm text-gray-700 font-medium mb-2">Trending up by 5.2% this month ↗</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Showing total visitors for the last 6 months. This is just some random text to test the layout. It spans
            multiple lines and should wrap around.
          </p>
        </div>
        <form onSubmit={handleCreateOutline}>


          <div className="space-y-5">
            {/* Header input */}
            <div>
              <Label htmlFor="header" className="text-sm font-semibold mb-2 block text-gray-700">
                Header
              </Label>
              <Input
                id="header"
                {...form.register("header")}
                placeholder="Cover page"
                className="border-gray-200 rounded-md"
              />
            </div>

            {/* Type & Status row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sectionType" className="text-sm font-semibold mb-2 block text-gray-700">
                  Type
                </Label>
                <Select
                  {...form.register("section")}
                >
                  <SelectTrigger className="h-10 rounded-md border border-gray-200 w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-semibold mb-2 block text-gray-700">
                  Status
                </Label>
                <Select
                  {...form.register("status")}
                >
                  <SelectTrigger className="h-10 rounded-md border border-gray-200 w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target & Limit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target" className="text-sm font-semibold mb-2 block text-gray-700">
                  Target
                </Label>
                <Input
                  id="target"
                  type="number"
                  {...form.register("target")}
                  className="border-gray-200 rounded-md h-10"
                />
              </div>

              <div>
                <Label htmlFor="limit" className="text-sm font-semibold mb-2 block text-gray-700">
                  Limit
                </Label>
                <Input
                  id="limit"
                  type="number"
                  {...form.register("limit")}
                  className="border-gray-200 rounded-md h-10"
                />
              </div>
            </div>

            {/* Reviewer */}
            <div>
              <Label htmlFor="reviewer" className="text-sm font-semibold mb-2 block text-gray-700">
                Reviewer
              </Label>
              <Select
                {...form.register("reviewer")}
              >
                <SelectTrigger className="h-10 rounded-md border border-gray-200 w-full">
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {activeOrg?.members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.user.name}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer actions: black primary full width, outline Done */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900 h-11 rounded-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full h-11 rounded-lg">
              Done
            </Button>
          </div>
        </form>

      </SheetContent>
    </Sheet>
  )
}
