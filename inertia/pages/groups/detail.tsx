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
import Group from '#models/group'
import { DeleteDialog } from '~/components/form/DeleteDialog'

const Page = ({
  group,
  flash,
}: {
  errors?: Record<string, string>
  group: Group | null
  flash: { failure?: string }
}) => {
  const [deleteIsOpen, setDeleteIsOpen] = useState(!!flash.failure || false)

  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[
        { title: 'Groups', to: '/admin/groups' },
        {
          title: group ? group.name || '' : 'Create group',
          to: '#',
        },
      ]}
      toolbarRight={
        group?.id ? (
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
                  Delete group
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : undefined
      }
    >
      {
        <Form action={'/admin/groups'} method="post">
          {({ errors, processing }) => (
            <BaseCard className="space-y-5">
              <input type="hidden" name="id" value={group?.id || ''} />
              <FormInput
                label="Name"
                name="name"
                defaultValue={group?.name || ''}
                error={errors?.name}
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
        message={`Are you sure you want to delete ${group?.name}? This action will delete all related data and cannot be undone.`}
        itemName={`group ${group?.name}`}
        url={`/admin/groups/${group?.id}`}
        errors={flash.failure ? [flash.failure] : []}
      />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
