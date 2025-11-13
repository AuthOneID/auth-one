import * as React from 'react'

import { Sidebar } from './sidebar'
import { Link, usePage } from '@inertiajs/react'
import { menus } from './menus'
import { SharedProps } from '@adonisjs/inertia/types'
import { MenuLink } from './MenuLink'

export function SidebarWithMenu({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { url } = usePage<SharedProps & Record<string, unknown>>()

  return (
    <Sidebar collapsible="icon" className="z-20" {...props}>
      <div className="py-2 px-4">
        <Link href="/" className="hover:bg-gray-100 rounded-md py-3 block">
          <img src="/img/logo.png" className="h-10 mx-auto" alt="logo" />
        </Link>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div className="flex flex-col px-2 gap-5">
          <div>
            <div className="px-3 text-[13px] font-medium text-gray-500 mb-2">Menu</div>
            {menus.map((item) =>
              item.url && item.icon ? (
                <MenuLink key={item.url} item={item} url={url} />
              ) : (
                <div className="px-3 text-[13px] font-medium text-gray-500 pt-3 pb-0.5">
                  {item.title}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
