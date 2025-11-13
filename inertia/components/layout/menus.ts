import { SquareTerminal, Users, Radio, ShieldUser, LucideProps, UtilityPole } from 'lucide-react'

interface Menu {
  title: string
  url: string
  icon: React.ForwardRefExoticComponent<
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
]
