
// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { OutlineSheet } from "@/components/outline-sheet"
// import { GripVertical, MoreVertical, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/dropdown-menu"
// import { useApiQuery } from "@/hooks/useApiQuery"
// import { OutlineResponse } from "@/interfaces/outline.interface"
// import { useSelector } from "react-redux"

// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core"
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// type ColumnKey = "sectionType" | "status" | "target" | "limit" | "reviewer"

// const defaultVisibleColumns: Record<ColumnKey, boolean> = {
//   sectionType: true,
//   status: true,
//   target: true,
//   limit: true,
//   reviewer: true,
// }

// function SortableTableRow({
//   item,
//   visibleColumns,
//   selectedRows,
//   toggleRowSelection,
//   getStatusColor,
//   getStatusBg,
//   handleDeleteItem,
// }: any) {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     cursor: "grab",
//   }

//   return (
//     <TableRow ref={setNodeRef} style={style} className="hover:bg-muted/50">
//       <TableCell>
//         <input
//           placeholder="select"
//           type="checkbox"
//           className="rounded"
//           checked={selectedRows.has(item.id)}
//           onChange={() => toggleRowSelection(item.id)}
//         />
//       </TableCell>
//       <TableCell {...attributes} {...listeners}>
//         <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
//       </TableCell>
//       <TableCell className="font-medium">{item.header}</TableCell>
//       {visibleColumns.sectionType && (
//         <TableCell>
//           <span className="text-sm text-muted-foreground">{item.section}</span>
//         </TableCell>
//       )}
//       {visibleColumns.status && (
//         <TableCell>
//           <span className={`inline-flex items-center gap-1 ${getStatusColor(item.status)}`}>
//             <span className={`w-2 h-2 rounded-full ${getStatusBg(item.status)}`}></span>
//             {item.status}
//           </span>
//         </TableCell>
//       )}
//       {visibleColumns.target && <TableCell className="text-right">{String(item.target)}</TableCell>}
//       {visibleColumns.limit && <TableCell className="text-right">{item.limit}</TableCell>}
//       {visibleColumns.reviewer && <TableCell>{item.reviewer}</TableCell>}
//       <TableCell>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="sm">
//               <MoreVertical className="w-4 h-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <OutlineSheet
//               item={item}
//               trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>}
//             />
//             <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-destructive">
//               Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </TableCell>
//     </TableRow>
//   )
// }

// export default function TablePage() {
//   const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
//   const [currentPage, setCurrentPage] = useState(1)
//   const [rowsPerPage, setRowsPerPage] = useState(10)
//   const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(defaultVisibleColumns)

//   const orgId = useSelector((s: any) => s.organization?.id)
//   const url = `/outline?page=${currentPage}&limit=${rowsPerPage}`
//   const queryKey = ["outline", orgId, currentPage, rowsPerPage]

//   const { data, isLoading, refetch } = useApiQuery<{ items?: OutlineResponse; total?: number } | OutlineResponse>(
//     queryKey,
//     url
//   )

//   const items: OutlineResponse = Array.isArray(data) ? (data as OutlineResponse) : (data?.items ?? [])
//   const totalCount: number = Array.isArray(data) ? (data as OutlineResponse).length : (data?.total ?? items.length)
//   const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage))

//   useEffect(() => {
//     refetch()
//     if (currentPage > totalPages) setCurrentPage(totalPages)
//   }, [currentPage, rowsPerPage])

//   useEffect(() => {
//     if (orgId) {
//       setCurrentPage(1)
//       refetch()
//     }
//   }, [orgId])

//   const toggleRowSelection = (id: string) => {
//     const newSelected = new Set(selectedRows)
//     if (newSelected.has(id)) newSelected.delete(id)
//     else newSelected.add(id)
//     setSelectedRows(newSelected)
//   }

//   const toggleColumnVisibility = (column: ColumnKey) => {
//     setVisibleColumns((prev) => ({
//       ...prev,
//       [column]: !prev[column],
//     }))
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Done":
//         return "text-green-600"
//       case "In Process":
//         return "text-yellow-600"
//       default:
//         return "text-gray-600"
//     }
//   }

//   const getStatusBg = (status: string) => {
//     switch (status) {
//       case "Done":
//         return "bg-green-100"
//       case "In Process":
//         return "bg-yellow-100"
//       default:
//         return "bg-gray-100"
//     }
//   }

//   const handleDeleteItem = (id: string) => { }

//   const sensors = useSensors(useSensor(PointerSensor))

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event
//     if (active.id !== over?.id) {
//       const oldIndex = items.findIndex((i) => i.id === active.id)
//       const newIndex = items.findIndex((i) => i.id === over?.id)
//       const newItems = arrayMove(items, oldIndex, newIndex)
//       console.log("New order:", newItems.map((i) => i.header))
//       // optionally update backend here
//     }
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {/* Header & Tabs */}
//       <div className="p-6 border-b border-border">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-3xl font-bold">Outline</h1>
//             <p className="text-sm text-muted-foreground mt-1">Manage your document sections</p>
//           </div>
//         </div>

//         <Tabs defaultValue="outline" className="w-full">
//           <div className="flex items-center justify-between">
//             <TabsList>
//               <TabsTrigger value="outline">Outline</TabsTrigger>
//               <TabsTrigger value="past">
//                 Past Performance <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">3</span>
//               </TabsTrigger>
//               <TabsTrigger value="personnel">
//                 Key Personnel <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">2</span>
//               </TabsTrigger>
//               <TabsTrigger value="focus">Focus Documents</TabsTrigger>
//             </TabsList>
//             <div className="flex gap-2">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline">Customize Columns</Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuCheckboxItem
//                     checked={visibleColumns.sectionType}
//                     onCheckedChange={() => toggleColumnVisibility("sectionType")}
//                   >
//                     Section Type
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem
//                     checked={visibleColumns.status}
//                     onCheckedChange={() => toggleColumnVisibility("status")}
//                   >
//                     Status
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem
//                     checked={visibleColumns.target}
//                     onCheckedChange={() => toggleColumnVisibility("target")}
//                   >
//                     Target
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem
//                     checked={visibleColumns.limit}
//                     onCheckedChange={() => toggleColumnVisibility("limit")}
//                   >
//                     Limit
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem
//                     checked={visibleColumns.reviewer}
//                     onCheckedChange={() => toggleColumnVisibility("reviewer")}
//                   >
//                     Reviewer
//                   </DropdownMenuCheckboxItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <OutlineSheet
//                 trigger={
//                   <Button>
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add Section
//                   </Button>
//                 }
//               />
//             </div>
//           </div>
//         </Tabs>
//       </div>

//       {/* Table */}
//       <div className="flex-1 overflow-auto p-6">
//         <Card>
//           <CardContent className="p-0">
//             <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-12">
//                       <input
//                         placeholder="select"
//                         type="checkbox"
//                         className="rounded"
//                         onChange={(e) => {
//                           if (e.target.checked) setSelectedRows(new Set(items?.map((i) => i.id)))
//                           else setSelectedRows(new Set())
//                         }}
//                       />
//                     </TableHead>
//                     <TableHead className="w-8"></TableHead>
//                     <TableHead>Header</TableHead>
//                     {visibleColumns.sectionType && <TableHead>Section Type</TableHead>}
//                     {visibleColumns.status && <TableHead>Status</TableHead>}
//                     {visibleColumns.target && <TableHead className="text-right">Target</TableHead>}
//                     {visibleColumns.limit && <TableHead className="text-right">Limit</TableHead>}
//                     {visibleColumns.reviewer && <TableHead>Reviewer</TableHead>}
//                     <TableHead className="w-10"></TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
//                   <TableBody>
//                     {items?.map((item) => (
//                       <SortableTableRow
//                         key={item.id}
//                         item={item}
//                         visibleColumns={visibleColumns}
//                         selectedRows={selectedRows}
//                         toggleRowSelection={toggleRowSelection}
//                         getStatusColor={getStatusColor}
//                         getStatusBg={getStatusBg}
//                         handleDeleteItem={handleDeleteItem}
//                       />
//                     ))}
//                   </TableBody>
//                 </SortableContext>
//               </Table>
//             </DndContext>
//           </CardContent>
//         </Card>

//         {/* Pagination */}
//         <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
//           <span>
//             {selectedRows.size} of {totalCount} row(s) selected.
//           </span>
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-2">
//               <span>Rows per page</span>
//               <Select
//                 value={String(rowsPerPage)}
//                 onValueChange={(val: string) => {
//                   setRowsPerPage(Number(val))
//                   setCurrentPage(1)
//                 }}
//               >
//                 <SelectTrigger className="w-24">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="20">20</SelectItem>
//                   <SelectItem value="30">30</SelectItem>
//                   <SelectItem value="40">40</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                 </SelectContent>
//               </Select>

//             </div>

//             <div className="flex items-center gap-1">
//               <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
//                 <ChevronsLeft className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </Button>

//               <span className="px-2">
//                 Page {currentPage} of {totalPages}
//               </span>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage(totalPages)}
//                 disabled={currentPage === totalPages}
//               >
//                 <ChevronsRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import { DataTable } from '@/components/data-table'
import React from 'react'

const page = () => {

  return (
    <>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Outline</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your document sections</p>
          </div>
        </div>
        <DataTable
        />
      </div>
    </>
  )
}

export default page