import { usePage } from '@inertiajs/react'
import { Header } from './header'
import { SidebarInset, SidebarProvider } from './sidebar'
import { SidebarWithMenu } from './sidebar_with_menu'
import { SharedProps } from '@adonisjs/inertia/types'
import { toast, Toaster } from 'sonner'
import { useEffect } from 'react'

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    props: { user, flash },
  } = usePage<SharedProps & Record<string, unknown>>()

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash?.success as string)
    } else if (flash?.error) {
      toast.error(flash?.error as string)
    }
  }, [flash])

  return (
    <SidebarProvider>
      <SidebarWithMenu></SidebarWithMenu>
      <SidebarInset>
        {user && <Header initial={user?.fullName?.[0].toUpperCase() || '?'} />}
        <div className="pt-14">{children}</div>
        <Toaster richColors position="top-right" />
      </SidebarInset>
    </SidebarProvider>
  )
}
