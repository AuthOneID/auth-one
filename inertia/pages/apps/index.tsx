import { AppCard } from './components/AppCard'
import { UserLayout } from '~/components/layout/UserLayout'
import React from 'react'

interface AppsProps {
  apps: any[]
}

const Page = ({ apps }: AppsProps) => {
  return (
    <>
      <div className="text-xl font-semibold mb-3.5">Discover Apps</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {apps.map((app) => (
          <AppCard key={app.id} name={app.name} url={app.appUrl}></AppCard>
        ))}
      </div>
    </>
  )
}

Page.layout = (page: React.ReactNode) => <UserLayout title="Discover Apps">{page}</UserLayout>

export default Page
