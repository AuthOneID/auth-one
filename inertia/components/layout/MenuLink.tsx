import { ChevronRight, Dot } from 'lucide-react'
import { Menu } from './menus'
import { Link } from '@inertiajs/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from './sidebar'

export const MenuLink = ({ item, url }: { item: Menu; url: string }) => {
  return item.children ? (
    <Collapsible className="group/collapsible">
      <SidebarGroup className="p-0 mb-0.5">
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger asChild>
            <button
              className={`flex gap-2.5 items-center pl-3 pr-2 h-8 rounded-md font-medium text-[13px] text-inherit! cursor-pointer ${
                (item.url !== '/' && url.startsWith(item.url!)) || url.split('?')[0] === item.url
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
                  url.startsWith(item.url!) ? 'bg-gray-200' : 'hover:bg-gray-100'
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
        (item.url !== '/' && url.startsWith(item.url!)) || url.split('?')[0] === item.url
          ? 'bg-sidebar-primary text-sidebar-primary-foreground!'
          : 'hover:bg-gray-100'
      }`}
      key={item.url}
    >
      {item.icon && <item.icon className="h-4 w-4" />}
      <span>{item.title}</span>
    </Link>
  )
}

// export const MenuLinkx = ({ item, url }: { item: Menu; url: string }) => {
//   return (
//     <React.Fragment key={item.url}>
//       <Link
//         href={item.url}
//         className={`flex gap-2.5 items-center pl-3 pr-2 h-8 rounded-md font-medium text-[13px] ${
//           (item.url !== '/' && url.startsWith(item.url!)) || url.split('?')[0] === item.url
//             ? 'bg-sidebar-primary text-sidebar-primary-foreground!'
//             : 'hover:bg-gray-100'
//         }`}
//         key={item.url}
//         onClick={(e) => {
//           e.preventDefault()
//           if (item.children) {
//             console.log('ok')
//           } else {
//             router.visit(item.url!)
//           }
//         }}
//       >
//         {item.icon && <item.icon className="h-4 w-4" />}
//         <span>{item.title}</span>
//       </Link>

//       {item.children && (
//         <ul
//           className={`flex flex-col overflow-hidden pt-0.5 text-[13px]`}
//           style={{
//             height:
//               location.pathname.length > 1 &&
//               [item.url, ...item.children.map((x) => x.url)].some((x) =>
//                 location.pathname.startsWith(x!)
//               )
//                 ? `${2 * item.children.length}rem`
//                 : '0rem',
//             transition: 'height 0.15s cubic-bezier(0.19, 0.91, 0.38, 1)',
//           }}
//         >
//           {item.children.map((child) => (
//             <Link
//               href={child.url}
//               className={`flex gap-2.5 items-center pl-3 pr-2 h-8 rounded-md font-medium ${
//                 url.startsWith(item.url!) ? 'bg-gray-200' : 'hover:bg-gray-100'
//               }`}
//               key={child.url}
//             >
//               <Dot className="h-4 w-4" />
//               <span>{child.title}</span>
//             </Link>
//           ))}
//         </ul>
//       )}
//     </React.Fragment>
//   )
// }
