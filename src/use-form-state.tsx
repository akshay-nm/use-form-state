import { useCallback, useEffect, useState } from 'react'
function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

type TextValidator = (x: string) => boolean
type ChangeHandler = (x: string) => void

interface FormStateReturnType {
  isValid: boolean
  isValidating: boolean
  triggerWarnings: () => void
  triggerValidation: () => void
  reset: () => void
  [key: string]: any
}

const generateReturnPayload = (
  names: Array<string>,
  values: Array<string>,
  warnings: Array<boolean>,
  onChangeHandlers: Array<ChangeHandler>,
  valids: Array<boolean>
) => {
  if (
    !(
      names.length === values.length &&
      values.length === warnings.length &&
      warnings.length === onChangeHandlers.length &&
      onChangeHandlers.length === valids.length
    )
  )
    throw Error('@akshay-nm/use-form-state: Invalid hook configuration.')

  let payload = {}
  names.forEach((name, i) => {
    payload = {
      ...payload,
      [camelize(name)]: values[i],
      [camelize(`on ${name} Change`)]: onChangeHandlers[i],
      [camelize(`show ${name} Warning`)]: warnings[i],
      [camelize(`is ${name} valid`)]: valids[i]
    }
  })
  return payload
}

interface TextInputConfig {
  name: string
  defaultValue: string
  defaultIsValid: boolean
  mustBeValid: boolean
  validator: TextValidator
}

interface UseFormStateConfig {
  states: TextInputConfig[]
  debug: boolean
}

export const useFormState = ({ states, debug }: UseFormStateConfig) => {
  const [names] = useState<Array<string>>(states.map((state) => state.name))
  const [values, setValues] = useState<Array<string>>(
    states.map((state) => state.defaultValue)
  )
  const [mandatory] = useState<Array<boolean>>(
    states.map((state) => state.mustBeValid)
  )
  const [validators] = useState<Array<TextValidator>>(
    states.map((state) => state.validator)
  )
  const [valids, setValids] = useState<Array<boolean>>(
    states.map((state) => state.defaultIsValid)
  )
  const [needValidations, setNeedValidations] = useState<Array<boolean>>(
    states.map(() => false)
  )
  const [edits, setEdits] = useState<Array<boolean>>(states.map(() => false))
  const [warnings, setWarnings] = useState<Array<boolean>>(
    states.map(() => false)
  )
  const [isValid, setIsValid] = useState<boolean>(false)
  const [isValidating, setIsValidating] = useState<boolean>(false)

  useEffect(() => {
    setIsValidating(() => {
      let v = false
      needValidations.forEach((val) => {
        if (val) v = true
      })
      return v
    })
  }, [needValidations])

  // run validations when needed
  const validate = useCallback(() => {
    needValidations.forEach((needsValidation, index) => {
      if (needsValidation) {
        setValids((prev) => {
          const arr = [...prev]
          arr[index] = validators[index](values[index])
          return arr
        })
        setNeedValidations((prev) => {
          const arr = [...prev]
          arr[index] = false
          return arr
        })
      }
    })
  }, [needValidations, validators, values])
  useEffect(() => validate(), [validate])

  const triggerWarnings = useCallback(() => {
    mandatory.forEach((isMandatory, index) => {
      if (isMandatory) {
        setWarnings((prev) => {
          const arr = [...prev]
          arr[index] = !needValidations[index] && !valids[index] && edits[index]
          return arr
        })
      }
    })
  }, [valids, needValidations, edits, mandatory])
  useEffect(() => triggerWarnings(), [triggerWarnings])

  // check if form is valid
  useEffect(() => {
    if (!isValidating)
      setIsValid(() => {
        let answer = true
        mandatory.forEach((isMandatory, index) => {
          if (isMandatory) if (!valids[index]) answer = false
        })
        return answer
      })
  }, [valids, mandatory, isValidating])

  // handle changes in form
  const onChangeHandler = useCallback((index, value) => {
    setValues((prev) => {
      const arr = [...prev]
      arr[index] = value
      return arr
    })
    setNeedValidations((prev) => {
      const arr = [...prev]
      arr[index] = true
      return arr
    })
    setEdits((prev) => {
      const arr = [...prev]
      arr[index] = true
      return arr
    })
  }, [])

  const triggerValidation = useCallback(() => {
    setEdits((prev) => {
      const arr = [...prev]
      arr.fill(true)
      return arr
    })
    setNeedValidations((prev) => {
      const arr = [...prev]
      arr.fill(true)
      return arr
    })
  }, [])

  const reset = useCallback(() => {
    setValues(states.map((state) => state.defaultValue))
    setValids(states.map((state) => state.defaultIsValid))
    setNeedValidations(states.map(() => false))
    setIsValid(false)
  }, [states])

  const resetState = useCallback(
    (index) => {
      setValues((prev) => {
        const arr = [...prev]
        arr[index] = states[index].defaultValue
        return arr
      })
      setValids((prev) => {
        const arr = [...prev]
        arr[index] = states[index].defaultIsValid
        return arr
      })
      setNeedValidations((prev) => {
        const arr = [...prev]
        arr[index] = false
        return arr
      })
    },
    [states]
  )

  const setState = useCallback((index, value, isValid, needsValidation) => {
    setValues((prev) => {
      const arr = [...prev]
      arr[index] = value
      return arr
    })
    setValids((prev) => {
      const arr = [...prev]
      arr[index] = isValid
      return arr
    })
    setNeedValidations((prev) => {
      const arr = [...prev]
      arr[index] = needsValidation
      return arr
    })
  }, [])

  const [onChangeHandlers] = useState(
    states.map((state, index) => (value) => onChangeHandler(index, value))
  )
  const [resetStates] = useState(
    states.map((state, index) => () => resetState(index))
  )
  const [setStates] = useState(
    states.map((state, index) => (value, isValid, needsValidation) =>
      setState(index, value, isValid, needsValidation)
    )
  )

  // logging
  useEffect(() => {
    if (debug) console.log('form state: names: ', names)
  }, [debug, names])
  useEffect(() => {
    if (debug) console.log('form state: values: ', values)
  }, [debug, values])
  useEffect(() => {
    if (debug) console.log('form state: edits: ', edits)
  }, [debug, edits])
  useEffect(() => {
    if (debug) console.log('form state: needValidations: ', needValidations)
  }, [debug, needValidations])
  useEffect(() => {
    if (debug) console.log('form state: valids: ', valids)
  }, [debug, valids])
  useEffect(() => {
    if (debug) console.log('form state: validators: ', validators)
  }, [debug, validators])
  useEffect(() => {
    if (debug) console.log('form state: mandatory: ', mandatory)
  }, [debug, mandatory])
  useEffect(() => {
    if (debug) console.log('form state: warnings: ', warnings)
  }, [debug, warnings])
  useEffect(() => {
    if (debug) console.log('form state: isValidating: ', isValidating)
  }, [debug, isValidating])
  useEffect(() => {
    if (debug) console.log('form state: isValid: ', isValid)
  }, [debug, isValid])
  useEffect(() => {
    if (debug) console.log('form state: onChangeHandlers: ', onChangeHandlers)
  }, [debug, onChangeHandlers])

  const [payload, setPayload] = useState(
    generateReturnPayload(names, values, warnings, onChangeHandlers, valids)
  )

  useEffect(() => {
    setPayload(
      generateReturnPayload(names, values, warnings, onChangeHandlers, valids)
    )
  }, [names, values, warnings, onChangeHandlers, valids])

  const returned: FormStateReturnType = {
    isValid,
    isValidating,
    triggerWarnings,
    triggerValidation,
    reset,
    ...payload
  }
  return returned
}
