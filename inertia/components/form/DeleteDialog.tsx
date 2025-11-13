import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '../ui/button'
import { CircleAlert } from 'lucide-react'
import { router } from '@inertiajs/react'

export const DeleteDialog = ({
  url,
  isOpen,
  setIsOpen,
  errors,
  message,
  itemName,
}: {
  url: string
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  errors?: string[]
  message: string
  itemName?: string
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        setIsOpen(e)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2 text-sm">Delete {itemName || 'Item'}?</DialogTitle>
          <DialogDescription className="hidden" />
          {errors && errors?.length > 0 && (
            <Alert variant={'destructiveSolid'} className="mb-2 border-0">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle className="text-[13px]">Sorry, there was an error:</AlertTitle>
              <AlertDescription className="text-xs">
                <ul className="list-disc list-outside pl-5">
                  {errors.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <div>{message}</div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            size={'sm'}
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size={'sm'}
            onClick={async () => {
              router.visit(url, { method: 'delete' })
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
