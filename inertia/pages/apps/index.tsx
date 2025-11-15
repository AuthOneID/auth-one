import { DropdownUser } from '~/components/layout/user_dropdown'
import { AppCard } from './components/AppCard'
import { Button } from '~/components/ui/button'
import { Link } from '@inertiajs/react'

interface AppsProps {
  apps: any[]
  isSuperAdmin: boolean
}

const Page = ({ apps, isSuperAdmin }: AppsProps) => {
  return (
    <div className="px-5 max-w-4xl mx-auto py-2.5 md:py-5">
      <header className="bg-background flex justify-between h-14 items-center gap-2">
        <div className="flex items-center gap-2.5">
          <img src="/img/logo.png" className="h-6 md:h-10 mx-auto" alt="logo" />
          <div className="text-xl md:text-3xl font-medium">AuthOne</div>
        </div>
        <div className="flex items-center gap-2.5">
          {isSuperAdmin && (
            <div>
              <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
                <Link href={'/admin'}>Admin</Link>
              </Button>
            </div>
          )}
          <DropdownUser initial="A"></DropdownUser>
        </div>
      </header>
      <div className="py-10">
        <div className="text-xl font-semibold mb-3.5">Discover Apps</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
          <AppCard name="Cendana15"></AppCard>
          <AppCard name="Instansi"></AppCard>
        </div>
      </div>
    </div>
  )
}

export default Page
