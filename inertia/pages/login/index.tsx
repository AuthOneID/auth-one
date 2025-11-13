import { Form } from '@inertiajs/react'
import { FormMessage } from '~/components/form/FormMessage'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const Page = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <img src="/img/logo.png" alt="logo" className="w-48" />
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center gap-0.5">
              <CardTitle className="text-xl">Welcome to AuthOne</CardTitle>
              <CardDescription>Login with your username and password</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Form action="/login" method="post" className="space-y-5">
                  {({ errors }) => {
                    const errorMessage = Object.entries(errors ?? {})
                      .filter((x) => x[0] !== 'username' && x[0] !== 'password')
                      .map((x) => x[1])
                      .join(', ')

                    return (
                      <>
                        <div className="grid gap-2">
                          <Label>Username</Label>
                          <Input placeholder="username" name="username" />
                          <FormMessage error={errors?.username} />
                        </div>

                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label>Password</Label>
                            <a
                              href="#"
                              className="ml-auto text-sm underline-offset-4 hover:underline invisible"
                            >
                              Forgot your password?
                            </a>
                          </div>
                          <Input type="password" name="password" placeholder="password" />
                          <FormMessage error={errors?.password} />
                        </div>

                        <div>
                          <Button type="submit" className="w-full">
                            Login
                          </Button>
                          {errorMessage && (
                            <div className="text-center text-destructive text-sm mt-2">
                              {errorMessage}
                            </div>
                          )}
                        </div>
                      </>
                    )
                  }}
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
