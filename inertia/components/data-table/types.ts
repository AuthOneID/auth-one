export type Column<T, K extends keyof T = keyof T> = {
  id: K
  label: string
  cell?: (row: T) => React.ReactNode
  headerClassName?: string
}
