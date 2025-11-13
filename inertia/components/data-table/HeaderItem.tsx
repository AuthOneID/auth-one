import { ArrowDown, ArrowUp } from 'lucide-react'
import { useSearchParams } from '~/hooks/use_search_params'

export const HeaderItem = ({
  className,
  children,
  accessorKey,
}: {
  className?: string
  children: React.ReactNode
  accessorKey: string
}) => {
  const { searchParams, updateSearchParams } = useSearchParams()
  const sortState =
    searchParams.get('sort') === accessorKey
      ? 'asc'
      : searchParams.get('sort') === `-${accessorKey}`
        ? 'desc'
        : undefined

  const toggleSorting = () => {
    if (sortState === 'asc') {
      updateSearchParams({ sort: `-${accessorKey}`, page: '1' })
    } else {
      updateSearchParams({ sort: `${accessorKey}`, page: '1' })
    }
  }

  return (
    <div className={className}>
      <button
        onClick={toggleSorting}
        className="inline-flex items-center gap-2 py-2.5 text-left text-sm font-medium"
      >
        {children}
        {sortState === 'asc' ? (
          <ArrowUp className="h-3 w-3"></ArrowUp>
        ) : sortState === 'desc' ? (
          <ArrowDown className="h-3 w-3"></ArrowDown>
        ) : undefined}
      </button>
    </div>
  )
}
