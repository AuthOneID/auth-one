import { Button } from '~/components/ui/button'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { Link } from '@inertiajs/react'
import { DataTable } from '~/components/data-table/DataTable'
import { ContainerWithBreadcumbs } from '~/components/Container'
import { InferPageProps } from '@adonisjs/inertia/types'
import React from 'react'
import { Column } from '~/components/data-table/types'
import UsersController from '#controllers/users_controller'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import User from '#models/user'

type Pengguna = ModelAttributes<User>

export const columns: Column<Pengguna & { referensi_name: string }>[] = [
  {
    id: 'fullName',
    label: 'Nama',
  },
  {
    id: 'username',
    label: 'Username',
  },
  {
    id: 'email',
    label: 'Email',
  },
]

const Page = ({ data, pagination }: InferPageProps<UsersController, 'index'>) => {
  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[{ title: 'Users', to: '/users' }]}
      toolbarRight={
        <Link href="/admin/users/create">
          <Button variant={'default'}>Create user</Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        rootActionLink="/admin/users"
        items={data}
        total={pagination.total}
      />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
