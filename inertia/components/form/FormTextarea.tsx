import { FormItem } from './FormItem'
import { FormMessage } from './FormMessage'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export const FormTextarea = ({
  label,
  error,
  ...textareaProps
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
}) => {
  return (
    <FormItem>
      <Label htmlFor={textareaProps.name}>{label}</Label>
      <Textarea {...textareaProps} placeholder={textareaProps.placeholder || label} />
      <FormMessage error={error} />
    </FormItem>
  )
}
