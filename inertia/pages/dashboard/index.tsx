import { AdminLayout } from '~/components/layout/AdminLayout'
import { ContainerWithBreadcumbs } from '~/components/Container'
import React from 'react'

const Page = () => {
  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[{ title: 'Welcome, AuthOne Default Admin', to: '/channel' }]}
    >
      hello
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
