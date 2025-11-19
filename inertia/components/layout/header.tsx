import { Link } from '@inertiajs/react'
import { SidebarTrigger } from './sidebar'
import { DropdownUser } from './user_dropdown'
import { Button } from '../ui/button'
import { AppWindow } from 'lucide-react'

export const Header = ({ initial }: { initial: string }) => {
  return (
    <header className="bg-background flex justify-between md:justify-end h-14 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 fixed top-0 left-0 right-0 w-full z-10">
      <div className="flex items-center gap-2 px-4 md:hidden">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
      </div>
      <Link href="/" className="hover:bg-gray-100 rounded-md py-3 block md:hidden">
        <img src="/img/logo.png" className="h-6 mx-auto" alt="logo" />
      </Link>
      <div className="px-5 flex items-center gap-2.5">
        <Button variant="outline" size="sm" className="inline-flex" asChild>
          <Link href={'/apps'}>
            <AppWindow /> Apps
          </Link>
        </Button>
        <DropdownUser initial={initial}></DropdownUser>
      </div>
    </header>
  )
}
