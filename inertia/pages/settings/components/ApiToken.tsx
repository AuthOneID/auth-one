import { Button } from '~/components/ui/button'
import { Copy, RefreshCcw } from 'lucide-react'
import { BaseCard } from '~/components/BaseCard'
import { toast } from 'sonner'
import { useForm } from '@inertiajs/react'

export const ApiToken = ({ token }: { token: null | string }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const { post, processing } = useForm({
    action: 'generate_api_token',
  })

  return (
    <BaseCard className="space-y-5 mb-6">
      <h3 className="text-base font-semibold">API Token</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 p-2 bg-muted rounded-md text-sm break-all">{token || '-'}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(token || '', 'API Token')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault()
                if (!window.confirm('Are you sure you want to regenerate the API token?')) {
                  return
                }
                return post('/admin/settings', { preserveScroll: true })
              }}
            >
              <input type="hidden" name="action" value="generate_api_token" />
              <Button variant="outline" size="sm" type="submit" disabled={processing}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </BaseCard>
  )
}
