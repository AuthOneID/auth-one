import { Label } from '../ui/label'
import { FormItem } from './FormItem'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { FormMessage } from './FormMessage'

export const FormSelect = ({
  label,
  error,
  items,
  name,
  placeholder,
  defaultValue,
}: {
  label: string
  error?: string
  items?: { value: string; label: string }[]
  name: string
  placeholder?: string
  defaultValue?: string
}) => {
  return (
    <FormItem>
      <Label htmlFor={name}>{label}</Label>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || 'Select item'} />
        </SelectTrigger>
        <SelectContent>
          {items?.length === 0 ? (
            <SelectItem value="" disabled>
              No options found.
            </SelectItem>
          ) : (
            items?.map((item, index) => (
              <SelectItem value={item.value} key={index}>
                {item.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <FormMessage error={error} />
    </FormItem>
  )
}
