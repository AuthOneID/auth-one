import { Button } from '~/components/ui/button'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { Link } from '@inertiajs/react'
import { DataTable } from '~/components/data-table/DataTable'
import { ContainerWithBreadcumbs } from '~/components/Container'
import { InferPageProps } from '@adonisjs/inertia/types'
import React from 'react'
import { Column } from '~/components/data-table/types'
import GroupsController from '#controllers/groups_controller'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Group from '#models/group'

type GroupType = ModelAttributes<Group>

export const columns: Column<GroupType>[] = [
  {
    id: 'name',
    label: 'Name',
  },
]

const Page = ({ data, pagination }: InferPageProps<GroupsController, 'index'>) => {
  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[{ title: 'Groups', to: '/admin/groups' }]}
      toolbarRight={
        <Link href="/admin/groups/create">
          <Button variant={'default'}>Create group</Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rootActionLink="/admin/groups"
        items={data}
        total={pagination.total}
      />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
