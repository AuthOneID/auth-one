import { ContainerWithBreadcumbs } from '~/components/Container'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { useState } from 'react'
import { ChevronDown, Loader2, Trash2, Copy } from 'lucide-react'
import { Form } from '@inertiajs/react'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { BaseCard } from '~/components/BaseCard'
import { FormInput } from '~/components/form/FormInput'
import Role from '#models/role'
import { DeleteDialog } from '~/components/form/DeleteDialog'
import { toast } from 'sonner'

const Page = ({
  role,
  flash,
}: {
  errors?: Record<string, string>
  role: Role | null
  flash: { failure?: string }
}) => {
  const [deleteIsOpen, setDeleteIsOpen] = useState(!!flash.failure || false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[
        { title: 'Roles', to: '/admin/roles' },
        {
          title: role ? role.name || '' : 'Create role',
          to: '#',
        },
      ]}
      toolbarRight={
        role?.id ? (
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
                  Delete role
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : undefined
      }
    >
      <Form action={role ? `/admin/roles/${role.id}?_method=PATCH` : '/admin/roles'} method="post">
        {({ errors, processing }) => (
          <BaseCard className="space-y-5">
            <h3 className="text-base font-semibold mb-3">Role Details</h3>

            {role?.id && (
              <div>
                <label className="text-sm font-medium">Role ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded-md text-sm break-all">
                    {role.id}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => copyToClipboard(role.id, 'Role ID')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <input type="hidden" name="id" value={role?.id || ''} />
            <FormInput
              label="Name"
              name="name"
              defaultValue={role?.name || ''}
              error={errors?.name}
            />

            <Button type="submit" className="w-full" disabled={processing}>
              <Loader2
                className={`h-4 w-4 animate-spin ${processing ? 'opacity-100' : 'opacity-0'}`}
              />
              <span className="pr-4">Submit</span>
            </Button>
          </BaseCard>
        )}
      </Form>

      <DeleteDialog
        isOpen={deleteIsOpen}
        setIsOpen={setDeleteIsOpen}
        message={`Are you sure you want to delete ${role?.name}? This action will delete all related data and cannot be undone.`}
        itemName={`role ${role?.name}`}
        url={`/admin/roles/${role?.id}`}
        errors={flash.failure ? [flash.failure] : []}
      />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
