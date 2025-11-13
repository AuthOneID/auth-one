import { cn } from '~/lib/utils'

export function FormMessage({ className, error }: { className?: string; error?: string }) {
  if (!error) {
    return null
  }

  return (
    <p data-slot="form-message" className={cn('text-destructive text-sm', className)}>
      {error}
    </p>
  )
}
