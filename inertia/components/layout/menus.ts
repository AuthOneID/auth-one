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
    url: '/',
    icon: SquareTerminal,
  },
  {
    title: 'Applications',
    url: '/applications',
    icon: SquareTerminal,
  },
  {
    title: 'Directory',
    url: '/directory',
    icon: FolderOpen,
    children: [
      {
        title: 'Users',
        url: '/users',
      },
      {
        title: 'Groups',
        url: '/groups',
      },
      {
        title: 'Roles',
        url: '/roles',
      },
    ],
  },
]
