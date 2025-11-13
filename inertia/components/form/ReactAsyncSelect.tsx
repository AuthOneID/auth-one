import { FormItem } from './FormItem'
import AsyncReactSelect from 'react-select/async'
import axios from 'axios'
import { cn } from '~/lib/utils'
import { FormMessage } from './FormMessage'
import { Label } from '../ui/label'

export const ReactAsyncSelect = ({
  label,
  error,
  name,
  placeholder,
  defaultValue,
  url,
  labelKey = 'name',
  isMulti,
}: {
  label: string
  error?: string
  name: string
  placeholder?: string
  defaultValue?: { id: string; name: string } | { id: string; name: string }[] | null
  url: string
  labelKey?: string
  isMulti?: boolean
}) => {
  const loadOptions = (
    inputValue: string,
    callback: (options: { label: string; value: string }[]) => void
  ) => {
    const run = async () => {
      const {
        data: { data },
      } = await axios.get<{ data: { id: string; name: string }[] }>(
        `${url}${url.includes('?') ? '&' : '?'}search=${inputValue}`
      )
      callback(data.map((item) => ({ value: item.id, label: item[labelKey as keyof typeof item] })))
    }
    run()
  }

  return (
    <FormItem>
      <Label htmlFor={name}>{label}</Label>
      <AsyncReactSelect
        isMulti={isMulti}
        unstyled
        loadOptions={loadOptions}
        defaultValue={
          defaultValue
            ? Array.isArray(defaultValue)
              ? defaultValue.map((item) => ({ value: item.id, label: item.name }))
              : { value: defaultValue.id, label: defaultValue.name }
            : undefined
        }
        name={name}
        defaultOptions
        placeholder={placeholder || ''}
        classNames={{
          control: ({ isFocused }) =>
            cn(
              'flex w-full !min-h-0 rounded-md border border-input bg-background px-3 py-[3px] text-sm shadow-sm transition-colors',
              'placeholder:text-muted-foreground focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isFocused && 'ring-1 ring-ring',
              error && 'border-destructive ring-destructive'
            ),
          placeholder: () => 'text-muted-foreground',
          input: () => 'text-sm',
          menu: () => 'mt-1 rounded-md border bg-popover text-popover-foreground shadow-md py-1',
          menuList: () => 'text-sm',
          option: ({ isFocused, isSelected }) =>
            cn(
              'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors',
              isSelected && 'bg-primary text-primary-foreground',
              isFocused && !isSelected && 'bg-accent text-accent-foreground',
              !isFocused &&
                !isSelected &&
                'text-popover-foreground hover:bg-accent hover:text-accent-foreground'
            ),
          multiValue: () => 'inline-flex items-center bg-secondary text-secondary-foreground mr-1',
          multiValueLabel: () => 'px-2 text-xs leading-none',
          multiValueRemove: () =>
            cn(
              'flex items-center justify-center p-1',
              'hover:bg-destructive hover:text-destructive-foreground'
            ),
          valueContainer: () => 'gap-1 flex flex-wrap items-center',
          clearIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
          dropdownIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
          indicatorSeparator: () => 'bg-input mx-2 my-2 w-[1px]',
          noOptionsMessage: () => 'text-muted-foreground p-2 text-sm',
        }}
      />
      <FormMessage error={error} />
    </FormItem>
  )
}
