import React, {
  CSSProperties,
  useState,
  useRef,
  FormEvent,
  ReactNode,
  useImperativeHandle
} from 'react'
import classNames from 'classnames'
import FormContext from './FormContext'

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string
  style?: CSSProperties
  onFinish?: (values: Record<string, any>) => void
  onFinishFailed?: (errors: Record<string, any>) => void
  initialValues?: Record<string, any>
  children?: ReactNode
}

export interface FormRefApi {
  getFieldsValue: () => Record<string, any>
  setFieldsValue: (values: Record<string, any>) => void
}

const Form = (props: FormProps, ref) => {
  const { className, style, children, onFinish, onFinishFailed, initialValues, ...others } = props

  const [values, setValues] = useState<Record<string, any>>(initialValues || {})

  useImperativeHandle(
    ref,
    () => {
      return {
        getFieldsValue() {
          return values
        },
        setFieldsValue(values: any) {
          for (const [key, value] of Object.entries(values)) {
            values[key] = value
          }
          setValues(values)
        }
      }
    },
    []
  )

  // eslint-disable-next-line @typescript-eslint/ban-types
  const validatorMap = useRef(new Map<string, Function>())

  const errors = useRef<Record<string, any>>({})

  const onValueChange = (key: string, value: any) => {
    values[key] = value
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    for (const [key, callbackFunc] of validatorMap.current) {
      if (typeof callbackFunc === 'function') {
        errors.current[key] = callbackFunc()
      }
    }

    const errorList = Object.keys(errors.current)
      .map((key) => {
        return errors.current[key]
      })
      .filter(Boolean)

    if (errorList.length) {
      onFinishFailed?.(errors.current)
    } else {
      onFinish?.(values)
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleValidateRegister = (name: string, cb: Function) => {
    validatorMap.current.set(name, cb)
  }

  const cls = classNames('ant-form', className)

  return (
    <FormContext.Provider
      value={{
        onValueChange,
        values,
        setValues: (v) => setValues(v),
        validateRegister: handleValidateRegister
      }}
    >
      <form
        {...others}
        className={cls}
        style={style}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

export default Form
