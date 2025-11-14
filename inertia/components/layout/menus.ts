import { SquareTerminal, LucideProps, FolderOpen, LayoutDashboard } from 'lucide-react'

export interface Menu {
  title: string
  url?: string
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  children?: {
    title: string
    url: string
  }[]
  roles?: number[]
}

export const menus: Menu[] = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Applications',
    url: '/admin/applications',
    icon: SquareTerminal,
  },
  {
    title: 'Directory',
    url: '#',
    icon: FolderOpen,
    children: [
      {
        title: 'Users',
        url: '/admin/users',
      },
      {
        title: 'Groups',
        url: '/admin/groups',
      },
      {
        title: 'Roles',
        url: '/admin/roles',
      },
    ],
  },
]
