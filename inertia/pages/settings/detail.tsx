import { ContainerWithBreadcumbs } from '~/components/Container'
import { AdminLayout } from '~/components/layout/AdminLayout'
import { ApiToken } from './components/ApiToken'
import { CrudSettings } from './components/CrudForm'

const Page = ({ settings }: { settings: Record<string, string | null> }) => {
  return (
    <ContainerWithBreadcumbs breadcrumbs={[{ title: 'Settings', to: '/admin/settings' }]}>
      <ApiToken token={settings?.api_token} />
      <CrudSettings settings={settings}></CrudSettings>
    </ContainerWithBreadcumbs>
  )
}

Page.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>

export default Page
