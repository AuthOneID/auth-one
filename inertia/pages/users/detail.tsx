import { ContainerWithBreadcumbs } from '~/components/Container'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { useState } from 'react'
import { ChevronDown, Loader2, Trash2 } from 'lucide-react'
import { Form } from '@inertiajs/react'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { BaseCard } from '~/components/BaseCard'
import { FormInput } from '~/components/form/FormInput'
import User from '#models/user'
import { DeleteDialog } from '~/components/form/DeleteDialog'
import { ReactAsyncSelect } from '~/components/form/ReactAsyncSelect'

const Page = ({
  user,
  flash,
}: {
  errors?: Record<string, string>
  user: User | null
  flash: { failure?: string }
}) => {
  const [deleteIsOpen, setDeleteIsOpen] = useState(!!flash.failure || false)

  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[
        { title: 'Users', to: '/admin/users' },
        {
          title: user ? user.fullName || '' : 'Create user',
          to: '#',
        },
      ]}
      toolbarRight={
        user?.id ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'outline'}
                size={'sm'}
                className="focus-visible:ring-0 focus-visible:border-0"
              >
                More Actions <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <button
                  className="px-3 py-1.5 text-xs font-medium text-red-700 hover:text-red-700 w-full hover:bg-red-100"
                  onClick={() => setDeleteIsOpen(true)}
                >
                  <Trash2 className="h-3 text-red-700 hover:text-red-700" />
                  Delete user
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : undefined
      }
    >
      {
        <Form
          action={user ? `/admin/users/${user.id}?_method=PATCH` : '/admin/users'}
          method="post"
        >
          {({ errors, processing }) => (
            <BaseCard className="space-y-5">
              {JSON.stringify(errors)}
              <h3 className="text-base font-semibold mb-3">User Details</h3>
              <FormInput
                label="Nama"
                name="name"
                defaultValue={user?.fullName || ''}
                error={errors?.name}
              />
              <FormInput
                label="Username"
                name="username"
                defaultValue={user?.username || ''}
                error={errors?.username}
              />
              <FormInput
                label="Email"
                name="email"
                defaultValue={user?.email || ''}
                error={errors?.email}
              />

              <h3 className="text-base font-semibold mb-3">Permissions</h3>
              <ReactAsyncSelect
                label="Groups"
                name="groupIds[]"
                placeholder="Groups"
                url="/admin/groups?json=1"
                error={errors?.groupIds}
                defaultValue={(user?.groups as { id: string; name: string }[]) || []}
                isMulti
              />

              <Button type="submit" className="w-full" disabled={processing}>
                <Loader2
                  className={`h-4 w-4 animate-spin ${processing ? 'opacity-100' : 'opacity-0'}`}
                />
                <span className="pr-4">Simpan</span>
              </Button>
            </BaseCard>
          )}
        </Form>
      }

      <DeleteDialog
        isOpen={deleteIsOpen}
        setIsOpen={setDeleteIsOpen}
        message={`Are you sure you want to delete ${user?.fullName}? This action will delete all related data and cannot be undone.`}
        itemName={`user ${user?.fullName}`}
        url={`/admin/users/${user?.id}`}
        errors={flash.failure ? [flash.failure] : []}
      />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
