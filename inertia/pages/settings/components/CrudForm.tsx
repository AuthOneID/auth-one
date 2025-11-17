import { Button } from '~/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Form } from '@inertiajs/react'
import { BaseCard } from '~/components/BaseCard'
import { FormInput } from '~/components/form/FormInput'

export const CrudSettings = ({ settings }: { settings: Record<string, string | null> }) => {
  return (
    <Form method="post">
      {({ errors, processing }) => (
        <BaseCard className="space-y-5">
          <h3 className="text-base font-semibold">Appearance</h3>
          <FormInput
            label="Title"
            name="title"
            defaultValue={settings?.title || ''}
            error={errors?.title}
          />
          <div className="space-y-1.5">
            <FormInput label="Logo" name="logo" type="file" error={errors?.logo} />
            {!!settings?.logo && (
              <img src={settings?.logo?.replace('storage', '')} alt="Logo" className="h-10" />
            )}
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            <Loader2
              className={`h-4 w-4 animate-spin ${processing ? 'opacity-100' : 'opacity-0'}`}
            />
            <span className="pr-4">Simpan</span>
          </Button>
        </BaseCard>
      )}
    </Form>
  )
}
