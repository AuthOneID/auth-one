import { SquareTerminal, LucideProps, FolderOpen } from 'lucide-react'

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
    icon: SquareTerminal,
  },
  {
    title: 'Applications',
    url: '/applications',
    icon: SquareTerminal,
  },
  {
    title: 'Directory',
    url: '#',
    icon: FolderOpen,
    children: [
      {
        title: 'Users',
        url: '/admin/directory/users',
      },
      {
        title: 'Groups',
        url: '/admin/directory/groups',
      },
      {
        title: 'Roles',
        url: '/admin/directory/roles',
      },
    ],
  },
]
