import * as React from 'react'
import { InputField, type InputFieldProps } from './InputField'
import { cn } from '../utils'

export interface FormFieldProps extends Omit<InputFieldProps, 'id' | 'className'> {
  label: string
  id?: string
  wrapperClassName?: string
  labelClassName?: string
  inputClassName?: string
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, wrapperClassName, labelClassName, inputClassName, ...props }, ref) => {
    const fallbackId = React.useId()
    const inputId = id ?? fallbackId

    return (
      <div className={cn('space-y-2', wrapperClassName)}>
        <label htmlFor={inputId} className={cn('text-sm font-medium', labelClassName)}>
          {label}
        </label>
        <InputField id={inputId} ref={ref} className={inputClassName} {...props} />
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export { FormField }
