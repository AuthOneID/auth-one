import { Button } from '~/components/ui/button'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { Link } from '@inertiajs/react'
import { DataTable } from '~/components/data-table/DataTable'
import { ContainerWithBreadcumbs } from '~/components/Container'
import { InferPageProps } from '@adonisjs/inertia/types'
import React from 'react'
import { Column } from '~/components/data-table/types'
import RolesController from '#controllers/roles_controller'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Role from '#models/role'

type RoleType = ModelAttributes<Role>

export const columns: Column<RoleType>[] = [
  {
    id: 'name',
    label: 'Name',
  },
]

const Page = ({ data, pagination }: InferPageProps<RolesController, 'index'>) => {
  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[{ title: 'Roles', to: '/admin/roles' }]}
      toolbarRight={
        <Link href="/admin/roles/create">
          <Button variant={'default'}>Create role</Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rootActionLink="/admin/roles"
        items={data}
        total={pagination.total}
      />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
