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
import { FormTextarea } from '~/components/form/FormTextarea'
import Application from '#models/application'
import { DeleteDialog } from '~/components/form/DeleteDialog'
import { toast } from 'sonner'
import { ReactAsyncSelect } from '~/components/form/ReactAsyncSelect'

const Page = ({
  application,
  flash,
}: {
  errors?: Record<string, string>
  application: Application | null
  flash: { failure?: string; secret?: string }
}) => {
  const [deleteIsOpen, setDeleteIsOpen] = useState(!!flash.failure || false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <ContainerWithBreadcumbs
      breadcrumbs={[
        { title: 'Applications', to: '/admin/applications' },
        {
          title: application ? application.name || '' : 'Create application',
          to: '#',
        },
      ]}
      toolbarRight={
        application?.id ? (
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
                  Delete application
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : undefined
      }
    >
      {application?.id && (
        <BaseCard className="space-y-5 mb-6">
          <h3 className="text-base font-semibold">Client Credentials</h3>
          {flash.secret && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">
                    Important: Save your client secret
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                    The client secret is only shown once for security reasons. Make sure to copy and
                    save it in a secure location before leaving this page. You won't be able to see
                    it again.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client ID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 p-2 bg-muted rounded-md text-sm break-all">
                  {application.clientId}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(application.clientId, 'Client ID')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {flash.secret && (
              <div>
                <label className="text-sm font-medium">Client Secret</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded-md text-sm break-all">
                    {flash.secret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(flash.secret!, 'Client Secret')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </BaseCard>
      )}

      <Form
        action={
          application
            ? `/admin/applications/${application.id}?_method=PATCH`
            : '/admin/applications'
        }
        method="post"
        className="mb-6"
      >
        {({ errors, processing }) => (
          <BaseCard className="space-y-5">
            <h3 className="text-base font-semibold">Application Details</h3>
            <input type="hidden" name="id" value={application?.id || ''} />
            <FormInput
              label="Name"
              name="name"
              defaultValue={application?.name || ''}
              error={errors?.name}
            />
            <FormTextarea
              label="Redirect URIs"
              name="redirectUris"
              defaultValue={application?.redirectUris?.join('\n') || ''}
              error={
                Object.entries(errors ?? {}).filter(([key]) =>
                  key.startsWith('redirectUris')
                )[0]?.[1]
              }
              placeholder="Enter one redirect URI per line"
              rows={6}
            />

            <h3 className="text-base font-semibold">Access Control</h3>
            <ReactAsyncSelect
              label="Groups"
              name="groupIds[]"
              placeholder="Groups"
              url="/admin/groups?json=1"
              error={
                Object.entries(errors ?? {}).filter(([key]) => key.startsWith('groupIds'))[0]?.[1]
              }
              defaultValue={(application?.groups as { id: string; name: string }[]) || []}
              isMulti
            />
            <ReactAsyncSelect
              label="Roles"
              name="roleIds[]"
              placeholder="Roles"
              url="/admin/roles?json=1"
              error={
                Object.entries(errors ?? {}).filter(([key]) => key.startsWith('roleIds'))[0]?.[1]
              }
              defaultValue={(application?.roles as { id: string; name: string }[]) || []}
              isMulti
            />
            <ReactAsyncSelect
              label="Users"
              name="userIds[]"
              placeholder="Users"
              url="/admin/users?json=1"
              error={
                Object.entries(errors ?? {}).filter(([key]) => key.startsWith('userIds'))[0]?.[1]
              }
              defaultValue={
                (application?.users.map((x) => ({ id: x.id, name: x.fullName })) as {
                  id: string
                  name: string
                }[]) || []
              }
              isMulti
              labelKey="fullName"
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

      <DeleteDialog
        isOpen={deleteIsOpen}
        setIsOpen={setDeleteIsOpen}
        message={`Are you sure you want to delete ${application?.name}? This action will delete all related data and cannot be undone.`}
        itemName={`application ${application?.name}`}
        url={`/admin/applications/${application?.id}`}
        errors={flash.failure ? [flash.failure] : []}
      />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
