import { Button } from '~/components/ui/button'
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Form } from '@inertiajs/react'
import { BaseCard } from '~/components/BaseCard'
import User from '#models/user'
import { FormInput } from '~/components/form/FormInput'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { UserLayout } from '~/components/layout/UserLayout'

const Page = ({ user }: { user: User | null }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
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
    </>
  )
}

Page.layout = (page: React.ReactNode) => <UserLayout title="Profile">{page}</UserLayout>

export default Page
