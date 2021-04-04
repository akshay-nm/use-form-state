import { useState } from 'react'
import useFormState from '@akshay-nm/use-form-state'

const useLoginFormState = () => {
  const [spec] = useState({
    states: [
      {
        name: 'email',
        default: '',
        defaultIsValid: false,
        mustBeValid: true,
        validator: () => true
      },
      {
        name: 'password',
        default: '',
        defaultIsValid: false,
        mustBeValid: true,
        validator: (val) => val.length > 5
      }
    ]
  })

  const [
    isValid,
    isValidating,
    values,
    warnings,
    onChangeHandlers,
    resetFormState
  ] = useFormState(spec, true) // you can pass true as the second parameter if you want to see some logs

  return [
    isValid,
    isValidating,
    resetFormState,
    values[0],
    warnings[0],
    onChangeHandlers[0],
    values[1],
    warnings[1],
    onChangeHandlers[1]
  ]
}

export default useLoginFormState
