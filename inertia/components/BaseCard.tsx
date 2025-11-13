import { cn } from '~/lib/utils'

export const BaseCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('bg-background rounded-md shadow-sm px-3 md:px-5 py-6', className)}>
      {children}
    </div>
  )
}
