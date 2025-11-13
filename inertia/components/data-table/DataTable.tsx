import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { HeaderItem } from './HeaderItem'
import { router } from '@inertiajs/react'
import { useSearchParams } from '~/hooks/use_search_params'
import { Column } from './types'

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const DataTable = ({
  columns,
  rootActionLink,
  emptyMessage = 'No results.',
  filter,
  items,
  total,
  uniqueKey = 'id',
}: {
  columns: Column<any, any>[]
  rootActionLink?: string
  emptyMessage?: string
  filter?: React.ReactNode
  items: any[]
  total: number
  uniqueKey?: string
}) => {
  const { searchParams, updateSearchParams } = useSearchParams()
  const currentPage = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('page_size') || 10)

  // Get initial search value from URL params
  const initialSearchValue = searchParams.get('search') || ''
  const [searchValue, setSearchValue] = useState(initialSearchValue)

  // Debounce the search value with 500ms delay
  const debouncedSearchValue = useDebounce(searchValue, 500)

  // Update URL params when debounced search value changes
  useEffect(() => {
    if (debouncedSearchValue !== initialSearchValue) {
      updateSearchParams({ search: debouncedSearchValue || undefined, page: '1' })
    }
  }, [debouncedSearchValue])

  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(start + items.length - 1)

  return (
    <div className="w-full space-y-3 bg-white rounded-md py-5">
      <div className="flex items-center px-5 gap-2.5">
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value)
          }}
          className="max-w-sm"
        />

        {filter}
      </div>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, i) => {
                return (
                  <TableHead
                    key={column.id}
                    className={!i ? 'pl-5' : i === columns.length - 1 ? 'pr-5' : ``}
                  >
                    <HeaderItem accessorKey={column.id} className={column.headerClassName}>
                      {column.label}
                    </HeaderItem>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length ? (
              items.map((row) => {
                let mouseDownTarget: EventTarget | null = null
                const handleMouseDown = (e: React.MouseEvent) => {
                  mouseDownTarget = e.target
                }
                const handleMouseUp = (e: React.MouseEvent) => {
                  // Only navigate if:
                  // 1. We have a rootActionLink
                  // 2. Mouse down and up happened on the same target
                  // 3. No text selection occurred
                  if (
                    rootActionLink &&
                    mouseDownTarget === e.target &&
                    window.getSelection()?.toString() === ''
                  ) {
                    router.visit(`${rootActionLink}/${row[uniqueKey]}`)
                  }
                  mouseDownTarget = null
                }

                return (
                  <TableRow
                    key={row[uniqueKey]}
                    className={rootActionLink && 'cursor-pointer'}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                  >
                    {columns.map((column, i) => (
                      <TableCell
                        key={column.id}
                        className={!i ? 'pl-5' : i === columns.length - 1 ? 'pr-5' : ``}
                      >
                        {column.cell ? column.cell(row) : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 px-5">
        <div className="flex-1 text-muted-foreground">
          Showing {start} - {end} of {total}
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSearchParams({ page: currentPage - 1 })}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSearchParams({ page: currentPage + 1 })}
            disabled={currentPage * pageSize >= total}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
