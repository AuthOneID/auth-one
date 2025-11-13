import Select, { StylesConfig } from 'react-select'
import { Label } from '../ui/label'
import { ClientOnly } from '../ClientOnly'
import { FormMessage } from './FormMessage'

const selectStyles: StylesConfig<any, false> = {
  container: (base) => ({
    ...base,
  }),
  control: (base, state) => ({
    ...base,
    borderRadius: 'calc(var(--radius) /* 0.25rem = 4px */ - 2px)',
    borderColor: state.isFocused ? 'var(--ring)' : base.borderColor,
    boxShadow: state.isFocused
      ? '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)'
      : base.boxShadow,
  }),
  valueContainer: (base) => ({
    ...base,
    fontSize: 'var(--text-sm)',
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: 'var(--text-sm)',
  }),
}

export const ReactSelectClient = ({
  label,
  error,
  ...props
}: React.ComponentProps<typeof Select> & {
  label: string
  error?: string
}) => {
  return (
    <ClientOnly>
      <div className="grid gap-2">
        <Label htmlFor={props.name}>{label}</Label>
        <Select {...props} styles={selectStyles} />
        <FormMessage error={error} />
      </div>
    </ClientOnly>
  )
}
