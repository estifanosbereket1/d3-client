"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Mail } from "lucide-react"

// Reusable confirmation dialog
type ConfirmDialogProps = {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    trigger: React.ReactNode
}

function ConfirmDialog({ title, description, confirmText = "Confirm", cancelText = "Cancel", onConfirm, trigger }: ConfirmDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {cancelText}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm()
                            setOpen(false)
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmDialog