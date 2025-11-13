import * as React from 'react'
import { Dot } from 'lucide-react'

import { Sidebar } from './sidebar'
import { Link, usePage } from '@inertiajs/react'
import { menus } from './menus'
import { SharedProps } from '@adonisjs/inertia/types'

export function SidebarWithMenu({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    url,
    props: { user },
  } = usePage<SharedProps & Record<string, unknown>>()

  const filteredMenus = menus.filter((menu) => {
    return true
  })

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
            {filteredMenus.map((item) => (
              <React.Fragment key={item.url}>
                <Link
                  href={item.url}
                  className={`flex gap-2.5 items-center pl-3 pr-2 h-8 rounded-md font-medium text-[13px] ${
                    (item.url !== '/' && url.startsWith(item.url)) || url.split('?')[0] === item.url
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground!'
                      : 'hover:bg-gray-100'
                  }`}
                  key={item.url}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>

                {item.children && (
                  <ul
                    className={`flex flex-col overflow-hidden pt-0.5 text-[13px]`}
                    style={{
                      height:
                        location.pathname.length > 1 &&
                        [item.url, ...item.children.map((x) => x.url)].some((x) =>
                          location.pathname.startsWith(x)
                        )
                          ? `${2 * item.children.length}rem`
                          : '0rem',
                      transition: 'height 0.15s cubic-bezier(0.19, 0.91, 0.38, 1)',
                    }}
                  >
                    {item.children.map((child) => (
                      <Link
                        href={child.url}
                        className={`flex gap-2.5 items-center pl-3 pr-2 h-8 rounded-md font-medium ${
                          url.startsWith(item.url) ? 'bg-gray-200' : 'hover:bg-gray-100'
                        }`}
                        key={child.url}
                      >
                        <Dot className="h-4 w-4" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
