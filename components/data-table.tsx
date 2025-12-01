"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns,
    IconLoader,
    IconPlus,
    IconTrendingUp,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useSelector } from "react-redux"
import { useApiQuery } from "@/hooks/useApiQuery"
import { Outline, OutlineResponse } from "@/interfaces/outline.interface"
import { OutlineSheet } from "./outline-sheet"
import { Plus } from "lucide-react"
import { outlineSchema, outlineType } from "./schema/outline.schema"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth-client"
import { useApiMutation, useApiMutationWithId } from "@/hooks/useApiMutation"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { ChartAreaStacked } from "./trending.chart"
import ConfirmDialog from "./confirm.dialougue"



type InlineConfirmProps = {
    message: string
    onConfirm: () => void | Promise<void>
}

export function InlineConfirm({ message, onConfirm }: InlineConfirmProps) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onConfirm()
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <div className="inline-block relative">
            {!open && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    Delete
                </Button>
            )}

            {open && (
                <div className="absolute z-10 mt-2 w-64 p-4 rounded-lg border bg-background shadow-md">
                    <p className="mb-4 text-sm">{message}</p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}



export const schema = z.object({
    id: z.union([z.number(), z.string()]),
    header: z.string(),
    section: z.string().optional(),
    status: z.string().optional(),
    target: z.string().optional(),
    limit: z.string().optional(),
    reviewer: z.string().optional(),
})

function DragHandle({ id }: { id: string | number }) {
    const { attributes, listeners } = useSortable({ id })
    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent"
        >
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}



function DraggableRow({ row }: { row: Row<Outline> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function DataTable() {
    const orgId = useSelector((s: any) => s.organization?.id)

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [editingItem, setEditingItem] = React.useState<Outline | undefined>(undefined);

    const sortableId = React.useId()

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const page = pagination.pageIndex + 1
    const url = `/outline?page=${page}&limit=${pagination.pageSize}`
    const queryKey = ["outline", orgId, page, pagination.pageSize, sorting, columnFilters]

    const { data: apiData, isLoading, refetch } = useApiQuery<{ items?: OutlineResponse; total?: number } | any[]>(
        queryKey,
        url
    )

    const { mutateAsync: deleteOutline } = useApiMutationWithId<number | string>("/outline", "delete", {
        onSuccess: (id) => {
            toast.success("Deleted successfully");
            refetch();
        },
        onError: () => {
            toast.error("Failed to delete");
        },
    });

    const columns: ColumnDef<Outline>[] = [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id} />,
        },
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "header",
            header: "Header",
            cell: ({ row }) => {
                return <TableCellViewer item={row.original} invalidate={refetch} />
            },
            enableHiding: false,
        },
        {
            accessorKey: "type",
            header: "Section Type",
            cell: ({ row }) => (
                <div className="w-32">
                    <Badge variant="outline" className="text-muted-foreground px-1.5">
                        {row.original.section ?? ""}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-muted-foreground px-1.5 inline-flex items-center gap-2">
                    {row.original.status === "Completed" ? (
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 size-4" />
                    ) : (
                        <IconLoader className="animate-spin size-4" />
                    )}
                    <span>{row.original.status ?? "—"}</span>
                </Badge>
            ),
        },

        {
            accessorKey: "target",
            header: () => <div className="w-full text-right pr-3">Target</div>,
            cell: ({ row }) => (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const val = (e.currentTarget.elements.namedItem("target") as HTMLInputElement)?.value
                        toast.promise(
                            new Promise((res) => setTimeout(res, 800)),
                            { loading: `Saving ${row.original.header}`, success: "Saved", error: "Error" }
                        )
                    }}
                >
                    <Label htmlFor={`${row.original.id}-target`} className="sr-only">
                        Target
                    </Label>

                    <div className="w-full flex justify-end pr-3">
                        <Input
                            name="target"
                            id={`${row.original.id}-target`}
                            defaultValue={row.original.target ?? ""}
                            className="h-8 w-20 border-transparent bg-transparent text-right shadow-none focus-visible:border"
                        />
                    </div>
                </form>
            ),
        },

        {
            accessorKey: "limit",
            header: () => <div className="w-full text-right pr-3">Limit</div>,
            cell: ({ row }) => (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const val = (e.currentTarget.elements.namedItem("limit") as HTMLInputElement)?.value
                        toast.promise(new Promise((res) => setTimeout(res, 800)), {
                            loading: `Saving ${row.original.header}`,
                            success: "Saved",
                            error: "Error",
                        })
                    }}
                >
                    <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
                        Limit
                    </Label>

                    <div className="w-full flex justify-end pr-3">
                        <Input
                            name="limit"
                            id={`${row.original.id}-limit`}
                            defaultValue={row.original.limit ?? ""}
                            className="h-8 w-20 border-transparent bg-transparent text-right shadow-none focus-visible:border"
                        />
                    </div>
                </form>
            ),
        },



        {
            accessorKey: "reviewer",
            header: "Reviewer",
            cell: ({ row }) => {
                const isAssigned = row.original.reviewer && row.original.reviewer !== "Assign reviewer"

                if (isAssigned) {
                    return <span>{row.original.reviewer}</span>
                }

                return (
                    <>
                        <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
                            Reviewer
                        </Label>
                        <Select>
                            <SelectTrigger
                                className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                                size="sm"
                                id={`${row.original.id}-reviewer`}
                            >
                                <SelectValue placeholder="Assign reviewer" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                                <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                )
            },
        },


        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex size-8 text-muted-foreground"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                            onClick={() => {
                                setEditingItem(row.original)
                                setAddSectionOpen(true)
                            }}
                        >Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />


                        <DropdownMenuItem
                            onClick={async () => {
                                await deleteOutline({ id: row.original.id })
                            }}
                        >Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />


                    </DropdownMenuContent>
                </DropdownMenu>

            ),
        }


    ]


    const serverItems: any[] = React.useMemo(() => {
        if (!apiData) return []
        if (Array.isArray(apiData)) return apiData
        return apiData.items ?? []
    }, [apiData])

    const totalCount: number = React.useMemo(() => {
        if (!apiData) return 0
        if (Array.isArray(apiData)) return apiData.length
        return apiData.total ?? (apiData.items ? apiData.items.length : 0)
    }, [apiData])

    const [localItems, setLocalItems] = React.useState<any[]>(() => serverItems ?? [])

    const [addSectionOpen, setAddSectionOpen] = React.useState(false);


    React.useEffect(() => {
        setLocalItems(serverItems ?? [])
    }, [serverItems])

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => localItems?.map((r) => r.id) ?? [],
        [localItems]
    )

    const table = useReactTable({
        data: localItems,
        columns,
        state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
        getRowId: (row) => String(row.id),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
        pageCount: Math.max(1, Math.ceil(totalCount / pagination.pageSize)),
    })




    React.useEffect(() => {
        refetch()
    }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters, orgId])

    const persistReorder = async (newOrder: any[]) => {

    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!active || !over || active.id === over.id) return

        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const newItems = arrayMove(localItems, oldIndex, newIndex)
        setLocalItems(newItems)

        toast.success("Order updated")

        persistReorder(newItems).catch((err) => {
            toast.error("Failed saving order")

        })
    }

    return (
        <>
            <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <Label htmlFor="view-selector" className="sr-only">
                        View
                    </Label>


                    <TabsList className="flex items-center space-x-2 @4xl/main:flex">
                        <TabsTrigger value="outline">Outline</TabsTrigger>
                        <TabsTrigger value="past-performance">
                            Past Performance <Badge variant="secondary">3</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="key-personnel">
                            Key Personnel <Badge variant="secondary">2</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <IconLayoutColumns />
                                    <span className="hidden lg:inline">Customize Columns</span>
                                    <span className="lg:hidden">Columns</span>
                                    <IconChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {table
                                    .getAllColumns()
                                    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" size="sm" onClick={() => setAddSectionOpen(true)}>
                            <IconPlus />
                            <span className="hidden lg:inline">Add Section</span>
                        </Button>


                    </div>
                </div>

                <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                    <div className="overflow-hidden rounded-lg border">
                        <DndContext
                            collisionDetection={closestCenter}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                            sensors={sensors}
                            id={sortableId}
                        >
                            <Table>
                                <TableHeader className="bg-muted sticky top-0 z-10">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>

                                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                    {table.getRowModel().rows?.length ? (
                                        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                            {table.getRowModel().rows.map((row) => (
                                                <DraggableRow key={row.id} row={row} />
                                            ))}
                                        </SortableContext>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                {isLoading ? "Loading..." : "No results."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </DndContext>
                    </div>

                    <div className="flex items-center justify-between px-4">
                        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>

                        <div className="flex w-full items-center gap-8 lg:w-fit">
                            <div className="hidden items-center gap-2 lg:flex">
                                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                    Rows per page
                                </Label>
                                <Select
                                    value={`${table.getState().pagination.pageSize}`}
                                    onValueChange={(value) => table.setPageSize(Number(value))}
                                >
                                    <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[10, 20, 30, 40, 50].map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex w-fit items-center justify-center text-sm font-medium">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </div>

                            <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                                    <span className="sr-only">Go to first page</span>
                                    <IconChevronsLeft />
                                </Button>
                                <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                    <span className="sr-only">Go to previous page</span>
                                    <IconChevronLeft />
                                </Button>
                                <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                    <span className="sr-only">Go to next page</span>
                                    <IconChevronRight />
                                </Button>
                                <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                                    <span className="sr-only">Go to last page</span>
                                    <IconChevronsRight />
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
                    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
                </TabsContent>

                <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
                </TabsContent>

                <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
                    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
                </TabsContent>
            </Tabs>


            <TableCellViewer
                item={editingItem}
                open={addSectionOpen}
                onOpenChange={(open) => {
                    setAddSectionOpen(open)
                    if (!open) setEditingItem(undefined)
                }}
                invalidate={refetch} />

        </>
    )
}

function TableCellViewer({
    item,
    open,
    onOpenChange,
    invalidate,
}: {
    item?: Outline
    open?: boolean
    onOpenChange?: (open: boolean) => void
    invalidate?: (options?: RefetchOptions) => Promise<QueryObserverResult<any[] | { items?: OutlineResponse; total?: number }, unknown>>
}) {
    const isMobile = useIsMobile()

    const SECTION_TYPE_OPTIONS = [
        "TableOfContents",
        "ExecutiveSummary",
        "TechnicalApproach",
        "Design",
        "FocusDocument",
        "Capabilities",
        "Narrative",
    ]

    const STATUS_OPTIONS = ["Pending", "InProgress", "Completed"]

    const form = useForm<outlineType>({
        defaultValues: {
            header: "",
            memberId: "",
        },
        resolver: zodResolver(outlineSchema),
        mode: "onTouched",
    })

    const { data: activeOrg } = authClient.useActiveOrganization()
    const { mutateAsync: createOutline, isPending: createPending } = useApiMutation<outlineType>("/outline", "post")
    const updateOutline = useApiMutationWithId<outlineType>("/outline", "patch")

    React.useEffect(() => {
        if (item) {
            form.setValue("header", item.header ?? "")
            form.setValue("section", item.section ?? "")
            form.setValue("status", item.status ?? "")
            form.setValue("target", item.target ?? 0)
            form.setValue("limit", item.limit ?? 0)
            form.setValue("memberId", item.reviewerId ?? "")
        } else {
            form.reset()
        }
    }, [item])

    const handleCreateOutline = form.handleSubmit(async (values) => {
        try {
            if (item?.id) {
                await updateOutline.mutateAsync({ id: item.id, body: values })
                toast.success("Updated successfully")

            } else {
                await createOutline(values)
                toast.success("Created successfully")
            }
            invalidate?.()
            form.reset()
            onOpenChange?.(false)
        } catch (e) {
            toast.error("Failed to save")
            console.error(e)
        }
    })

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item?.header}
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Form</DrawerTitle>
                    <DrawerDescription>Section details</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && (
                        <>
                            <ChartAreaStacked />
                            <Separator />
                        </>
                    )}

                    <form onSubmit={handleCreateOutline} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="header">Header</Label>
                            <Input {...form.register("header")} id="header" />
                            {form.formState.errors.header && (
                                <span className="text-red-500 text-sm">{form.formState.errors.header.message}</span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="section">Type</Label>
                                <Controller
                                    control={form.control}
                                    name="section"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="section" className="w-full">
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SECTION_TYPE_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>
                                                        {opt.replace(/([A-Z])/g, " $1").trim()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.section && (
                                    <span className="text-red-500 text-sm">{form.formState.errors.section.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="status">Status</Label>
                                <Controller
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="status" className="w-full">
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>
                                                        {opt}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.status && (
                                    <span className="text-red-500 text-sm">{form.formState.errors.status.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="target">Target</Label>
                                <Input type="number" {...form.register("target", { valueAsNumber: true })} id="target" />
                                {form.formState.errors.target && (
                                    <span className="text-red-500 text-sm">{form.formState.errors.target.message}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="limit">Limit</Label>
                                <Input type="number" {...form.register("limit", { valueAsNumber: true })} id="limit" />
                                {form.formState.errors.limit && (
                                    <span className="text-red-500 text-sm">{form.formState.errors.limit.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="reviewer">Reviewer</Label>
                            <Controller
                                control={form.control}
                                name="memberId"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue>
                                                {activeOrg?.members?.find((m) => m.userId === field.value)?.user.name}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activeOrg?.members?.map((member: any) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    {member.user.name}
                                                </SelectItem>
                                            )) || <SelectItem value="">No members</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {form.formState.errors.memberId && (
                                <span className="text-red-500 text-sm">{form.formState.errors.memberId.message}</span>
                            )}
                        </div>

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (item ? "Updating..." : "Submitting...") : item ? "Update" : "Submit"}
                        </Button>
                    </form>
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}






