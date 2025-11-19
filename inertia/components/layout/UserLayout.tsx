import { Head, usePage } from '@inertiajs/react'
import { DropdownUser } from '~/components/layout/user_dropdown'
import { SharedProps } from '@adonisjs/inertia/types'
import { toast, Toaster } from 'sonner'
import { useEffect } from 'react'

interface UserLayoutProps {
  children: React.ReactNode
  title?: string
}

export const UserLayout = ({ children, title }: UserLayoutProps) => {
  const { props } = usePage<SharedProps>()
  const { settings, user, flash } = props as any

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash?.success as string)
    } else if (flash?.error) {
      toast.error(flash?.error as string)
    }
  }, [flash])

  return (
    <div className="px-5 max-w-4xl mx-auto py-2.5 md:py-5">
      <Toaster richColors position="top-right" closeButton />
      <Head title={title || settings.title || 'AuthOne'} />
      <header className="bg-background flex justify-between h-14 items-center gap-2">
        <a href="/apps" className="flex items-center gap-2.5">
          <img src={settings.logo || '/img/logo.png'} className="h-6 md:h-10 mx-auto" alt="logo" />
          <div className="text-xl md:text-3xl font-medium">{settings.title || 'AuthOne'}</div>
        </a>
        <div className="flex items-center gap-2.5">
          <DropdownUser initial={user?.fullName?.[0].toUpperCase() || '?'}></DropdownUser>
        </div>
      </header>
      <div className="py-10">{children}</div>
    </div>
  )
}
