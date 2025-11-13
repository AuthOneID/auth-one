import { ChevronRight, Dot } from 'lucide-react'
import { Menu } from './menus'
import { Link } from '@inertiajs/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from './sidebar'

export const MenuLink = ({ item, pathname }: { item: Menu; pathname: string }) => {
  const isActive =
    item.url === '/admin'
      ? pathname === '/admin'
      : pathname.startsWith(item.url || '') ||
        (item.children?.some((child) => pathname.startsWith(child.url)) ?? false)

  return item.children ? (
    <Collapsible defaultOpen={isActive} className="group/collapsible">
      <SidebarGroup className="p-0 mb-0.5">
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger asChild>
            <button
              className={`flex gap-2.5 items-center pl-3 pr-2 h-8 rounded-md font-medium text-[13px] text-inherit! cursor-pointer ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground!'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            {item.children.map((child) => (
              <Link
                href={child.url}
                className={`flex gap-2.5 items-center pl-3 pr-2 h-8 rounded-md font-medium text-[13px] ${
                  pathname.startsWith(child.url!) ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                key={child.url}
              >
                <Dot className="h-4 w-4" />
                <span>{child.title}</span>
              </Link>
            ))}
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  ) : (
    <Link
      href={item.url}
      className={`flex gap-2.5 mb-0.5 items-center pl-3 pr-2 h-8 rounded-md font-medium text-[13px] ${
        isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground!' : 'hover:bg-gray-100'
      }`}
      key={item.url}
    >
      {item.icon && <item.icon className="h-4 w-4" />}
      <span>{item.title}</span>
    </Link>
  )
}
