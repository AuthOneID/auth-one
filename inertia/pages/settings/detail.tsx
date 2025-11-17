import { ContainerWithBreadcumbs } from '~/components/Container'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { ApiToken } from './components/ApiToken'

const Page = ({ settings }: { settings: Record<string, string | null> }) => {
  return (
    <ContainerWithBreadcumbs breadcrumbs={[{ title: 'Settings', to: '/admin/settings' }]}>
      <ApiToken token={settings?.api_token} />
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
