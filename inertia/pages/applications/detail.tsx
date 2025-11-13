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
                    {application.clientSecret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(application.clientSecret, 'Client Secret')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </BaseCard>
      )}

      <Form action={'/admin/applications'} method="post" className="mb-6">
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
              error={errors?.redirectUris}
              placeholder="Enter one redirect URI per line"
              rows={6}
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
