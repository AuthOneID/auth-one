import { useId } from 'react'
import { FormItem } from './FormItem'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { FormMessage } from './FormMessage'

export const FormInput = ({
  label,
  error,
  items,
  ...inputProps
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  items?: string[]
}) => {
  const id = useId()
  return (
    <FormItem>
      <Label htmlFor={inputProps.name}>{label}</Label>
      <Input
        {...inputProps}
        placeholder={inputProps.placeholder || label}
        list={items ? id : undefined}
      />
      <FormMessage error={error} />
      {items && (
        <datalist id={id}>
          {items.map((item, index) => (
            <option value={item} key={index} />
          ))}
        </datalist>
      )}
    </FormItem>
  )
}
