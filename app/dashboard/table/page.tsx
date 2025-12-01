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