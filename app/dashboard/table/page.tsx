"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OutlineSheet } from "@/components/outline-sheet"
import { GripVertical, MoreVertical, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface OutlineItem {
  id: string
  header: string
  sectionType: string
  status: "In Process" | "Done" | "Not Started"
  target: number
  limit: number
  reviewer: string
}

const mockData: OutlineItem[] = [
  {
    id: "1",
    header: "Cover page",
    sectionType: "Cover page",
    status: "In Process",
    target: 18,
    limit: 5,
    reviewer: "Eddie Lake",
  },
  {
    id: "2",
    header: "Table of contents",
    sectionType: "Table of contents",
    status: "Done",
    target: 29,
    limit: 24,
    reviewer: "Eddie Lake",
  },
  {
    id: "3",
    header: "Executive summary",
    sectionType: "Narrative",
    status: "Done",
    target: 10,
    limit: 13,
    reviewer: "Eddie Lake",
  },
  {
    id: "4",
    header: "Technical approach",
    sectionType: "Narrative",
    status: "Done",
    target: 27,
    limit: 23,
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: "5",
    header: "Design",
    sectionType: "Narrative",
    status: "In Process",
    target: 2,
    limit: 16,
    reviewer: "Jamik Tashpulatov",
  },
]

export default function TablePage() {
  const [items, setItems] = useState<OutlineItem[]>(mockData)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const handleSaveItem = (item: OutlineItem) => {
    const existingIndex = items.findIndex((i) => i.id === item.id)
    if (existingIndex >= 0) {
      const newItems = [...items]
      newItems[existingIndex] = item
      setItems(newItems)
    } else {
      setItems([...items, item])
    }
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "text-green-600"
      case "In Process":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-100"
      case "In Process":
        return "bg-yellow-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Outline</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your document sections</p>
          </div>
        </div>

        <Tabs defaultValue="outline" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="outline">Outline</TabsTrigger>
              <TabsTrigger value="past">
                Past Performance <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">3</span>
              </TabsTrigger>
              <TabsTrigger value="personnel">
                Key Personnel <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">2</span>
              </TabsTrigger>
              <TabsTrigger value="focus">Focus Documents</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline">Customize Columns</Button>
              <OutlineSheet
                onSave={handleSaveItem}
                trigger={
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                }
              />
            </div>
          </div>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      placeholder="row"
                      type="checkbox"
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(new Set(items.map((i) => i.id)))
                        } else {
                          setSelectedRows(new Set())
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Header</TableHead>
                  <TableHead>Section Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Target</TableHead>
                  <TableHead className="text-right">Limit</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <input
                        placeholder="select"
                        type="checkbox"
                        className="rounded"
                        checked={selectedRows.has(item.id)}
                        onChange={() => toggleRowSelection(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                    </TableCell>
                    <TableCell className="font-medium">{item.header}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{item.sectionType}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 ${getStatusColor(item.status)}`}>
                        <span className={`w-2 h-2 rounded-full ${getStatusBg(item.status)}`}></span>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{item.target}</TableCell>
                    <TableCell className="text-right">{item.limit}</TableCell>
                    <TableCell>{item.reviewer}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <OutlineSheet
                            item={item}
                            onSave={handleSaveItem}
                            trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>}
                          />
                          <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            {selectedRows.size} of {items.length} row(s) selected.
          </span>
          <div className="flex items-center gap-4">
            <span>Rows per page: 10</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
