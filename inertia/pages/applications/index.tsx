import { Button } from '~/components/ui/button'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { Link } from '@inertiajs/react'
import { DataTable } from '~/components/data-table/DataTable'
import { ContainerWithBreadcumbs } from '~/components/Container'
import { InferPageProps } from '@adonisjs/inertia/types'
import React from 'react'
import { Column } from '~/components/data-table/types'
import ApplicationController from '#controllers/application_controller'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Application from '#models/application'

type ApplicationType = ModelAttributes<Application>

export const columns: Column<ApplicationType>[] = [
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'clientId',
    label: 'Client ID',
  },
]

const Page = ({ data, pagination }: InferPageProps<ApplicationController, 'index'>) => {
  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[{ title: 'Applications', to: '/admin/applications' }]}
      toolbarRight={
        <Link href="/admin/applications/create">
          <Button variant={'default'}>Create application</Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rootActionLink="/admin/applications"
        items={data}
        total={pagination.total}
      />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
