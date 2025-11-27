"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OutlineItem {
  id: string
  header: string
  sectionType: string
  status: "In Process" | "Done" | "Not Started"
  target: number
  limit: number
  reviewer: string
}

interface OutlineSheetProps {
  item?: OutlineItem
  onSave: (item: OutlineItem) => void
  trigger?: React.ReactNode
}

export function OutlineSheet({ item, onSave, trigger }: OutlineSheetProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<OutlineItem>(
    item || {
      id: Math.random().toString(36).substr(2, 9),
      header: "",
      sectionType: "",
      status: "Not Started",
      target: 0,
      limit: 0,
      reviewer: "",
    },
  )

  const handleSubmit = () => {
    onSave(formData)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger || <Button variant="outline">Edit</Button>}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{item ? "Edit Section" : "Add Section"}</SheetTitle>
          <SheetDescription>Make changes to the outline section</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="header">Header</Label>
            <Input
              id="header"
              value={formData.header}
              onChange={(e) => setFormData({ ...formData, header: e.target.value })}
              placeholder="e.g., Cover page"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectionType">Section Type</Label>
            <Input
              id="sectionType"
              value={formData.sectionType}
              onChange={(e) => setFormData({ ...formData, sectionType: e.target.value })}
              placeholder="e.g., Narrative, Technical content"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Process">In Process</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Limit</Label>
              <Input
                id="limit"
                type="number"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewer">Reviewer</Label>
            <Input
              id="reviewer"
              value={formData.reviewer}
              onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })}
              placeholder="e.g., John Doe"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button onClick={handleSubmit} className="flex-1">
            Submit
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
