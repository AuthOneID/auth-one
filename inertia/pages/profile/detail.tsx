import { Button } from '~/components/ui/button'
import { useEffect, useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { Form, Link, usePage } from '@inertiajs/react'
import { BaseCard } from '~/components/BaseCard'
import User from '#models/user'
import { FormInput } from '~/components/form/FormInput'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { DropdownUser } from '~/components/layout/user_dropdown'
import { SharedProps } from '@adonisjs/inertia/types'
import { toast, Toaster } from 'sonner'

const Page = ({ user, isSuperAdmin }: { user: User | null; isSuperAdmin: boolean }) => {
  const {
    props: { settings, flash },
  } = usePage<SharedProps & Record<string, unknown>>()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash?.success as string)
    } else if (flash?.error) {
      toast.error(flash?.error as string)
    }
  }, [flash])

  return (
    <div className="px-5 max-w-4xl mx-auto py-2.5 md:py-5">
      <Toaster richColors position="top-right" closeButton />
      <header className="bg-background flex justify-between h-14 items-center gap-2">
        <div className="flex items-center gap-2.5">
          <img src={settings.logo || '/img/logo.png'} className="h-6 md:h-10 mx-auto" alt="logo" />
          <div className="text-xl md:text-3xl font-medium">{settings.title || 'AuthOne'}</div>
        </div>
        <div className="flex items-center gap-2.5">
          {isSuperAdmin && (
            <div>
              <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
                <Link href={'/admin'}>
                  <KeyRound /> Admin
                </Link>
              </Button>
            </div>
          )}
          <DropdownUser initial="A"></DropdownUser>
        </div>
      </header>
      <div className="py-10">
        <div className="text-xl font-semibold mb-3.5">Profile</div>
        <Form action={`/profile?_method=PATCH`} method="post">
          {({ errors, processing }) => (
            <BaseCard className="space-y-5">
              <FormInput
                label="Nama"
                name="name"
                defaultValue={user?.fullName || ''}
                error={errors?.name}
              />
              <FormInput
                label="Email"
                name="email"
                defaultValue={user?.email || ''}
                error={errors?.email}
              />

              <div className="space-y-4">
                {!!user && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-password" className="text-sm font-medium">
                      Set Password
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {showPassword ? 'Hide' : 'Show'}
                      </span>
                      <Switch
                        id="show-password"
                        checked={showPassword}
                        onCheckedChange={setShowPassword}
                      />
                    </div>
                  </div>
                )}

                {showPassword && (
                  <div className="space-y-4">
                    <FormInput
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      error={errors?.password}
                    />
                    <FormInput
                      label="Password Confirmation"
                      name="passwordConfirmation"
                      type="password"
                      placeholder="Confirm new password"
                      error={errors?.passwordConfirmation}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                <Loader2
                  className={`h-4 w-4 animate-spin ${processing ? 'opacity-100' : 'opacity-0'}`}
                />
                <span className="pr-4">Submit</span>
              </Button>
            </BaseCard>
          )}
        </Form>
      </div>
    </div>
  )
}

export default Page
