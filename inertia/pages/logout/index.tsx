import { useEffect } from 'react'
import { router } from '@inertiajs/react'

const Page = () => {
  useEffect(() => {
    router.visit('/logout', { method: 'post' })
  }, [])

  return (
    <div className="flex items-center justify-center min-h-svh bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div
          className={
            'inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary'
          }
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>

        {/* Logout info */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-medium text-foreground">Logging out</h1>
          <p className="text-sm text-muted-foreground animate-pulse">Redirecting...</p>
        </div>
      </div>
    </div>
  )
}

export default Page
