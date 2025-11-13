import { cn } from '~/lib/utils'

export const FormItem = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return <div className={cn('grid gap-2', className)}>{children}</div>
}
