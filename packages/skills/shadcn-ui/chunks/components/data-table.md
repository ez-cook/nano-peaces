# Data Table — shadcn/ui + TanStack Table

## Stack

```bash
npx shadcn@latest add table
npm i @tanstack/react-table
```

## File Structure

```
app/payments/
  ├── columns.tsx      ← column definitions (client component)
  ├── data-table.tsx   ← DataTable component (client component)
  └── page.tsx         ← server component, fetch data
```

## Step 1: Column Definitions

```tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.getValue('amount'))
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]
```

## Step 2: DataTable Component

```tsx
'use client'

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function DataTable<TData, TValue>({
  columns,
  data,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Progressive Features

Add these incrementally as needed:

### Pagination

```tsx
import { getPaginationRowModel } from "@tanstack/react-table"
const table = useReactTable({ ..., getPaginationRowModel: getPaginationRowModel() })
// Controls: table.previousPage(), table.nextPage(), table.getCanPreviousPage()
```

### Sorting

```tsx
import { getSortedRowModel, SortingState } from "@tanstack/react-table"
const [sorting, setSorting] = useState<SortingState>([])
const table = useReactTable({ ..., getSortedRowModel: getSortedRowModel(), onSortingChange: setSorting, state: { sorting } })
```

### Column Filtering

```tsx
import { getFilteredRowModel, ColumnFiltersState } from '@tanstack/react-table'
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
// Add onColumnFiltersChange: setColumnFilters, state: { columnFilters }
```

### Row Selection

```tsx
// Add checkbox column:
{ id: "select", header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)} />, cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={v => row.toggleSelected(!!v)} /> }
```

### Column Visibility

```tsx
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
// Add DropdownMenu to toggle columns: table.getAllColumns().filter(c => c.getCanHide())
```

## Anti-patterns

- ❌ Don't put columns + table + page in one file — separate for maintainability
- ❌ Don't skip `getCoreRowModel()` — required base
- ❌ Don't use native `<table>` — use shadcn `<Table>` components
- ❌ Don't load 10k+ rows client-side — use server-side pagination
