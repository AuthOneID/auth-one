'use client'

import { AppWindow, BadgeCheck, KeyRound, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Link, router, usePage } from '@inertiajs/react'
import { SharedProps } from '@adonisjs/inertia/types'

export const DropdownUser = ({ initial }: { initial: string }) => {
  const { url } = usePage()
  const {
    props: { isSuperAdmin },
  } = usePage<SharedProps & Record<string, unknown>>()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer outline-none">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">{initial}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          {url.startsWith('/admin') && (
            <DropdownMenuItem asChild>
              <Link href={'/apps'} className="cursor-pointer">
                <AppWindow />
                Apps
              </Link>
            </DropdownMenuItem>
          )}
          {url.startsWith('/apps') && isSuperAdmin && (
            <DropdownMenuItem asChild>
              <Link href={'/admin'} className="cursor-pointer">
                <KeyRound />
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={'/profile'} className="cursor-pointer">
              <BadgeCheck />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            router.visit('/logout', { method: 'post' })
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
