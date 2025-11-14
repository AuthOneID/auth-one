import { AdminLayout } from '~/components/layout/AdminLayout'
import { ContainerWithBreadcumbs } from '~/components/Container'
import React from 'react'
import { StatsCard } from '~/components/dashboard/StatsCard'
import { LoginChart } from '~/components/dashboard/LoginChart'
import { Users, Group, ShieldCheck, AppWindow } from 'lucide-react'

interface DashboardProps {
  stats: {
    totalUsers: number
    totalGroups: number
    totalRoles: number
    totalApplications: number
  }
  loginData: Array<{
    date: string
    success: number
    failed: number
  }>
}

const Page = ({ stats, loginData }: DashboardProps) => {
  return (
    <ContainerWithBreadcumbs breadcrumbs={[{ title: 'Dashboard', to: '/dashboard' }]}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="Registered users in the system"
          />
          <StatsCard
            title="Total Groups"
            value={stats.totalGroups}
            icon={Group}
            description="Active user groups"
          />
          <StatsCard
            title="Total Roles"
            value={stats.totalRoles}
            icon={ShieldCheck}
            description="Configured roles"
          />
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={AppWindow}
            description="Connected applications"
          />
        </div>

        {/* Login Activity Chart */}
        <LoginChart data={loginData} />
      </div>
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
