import { useCallback, useEffect, useState } from 'react'
function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}
const generateReturnPayload = (
  names = [],
  values = [],
  warnings = [],
  onChangeHandlers = [],
  valids = []
) => {
  const payload = {}
  if (
    names.length === values.length &&
    values.length === warnings.length &&
    warnings.length === onChangeHandlers.length &&
    onChangeHandlers.length === valids.length
  ) {
    names.forEach((name, i) => {
      payload[camelize(name)] = values[i]
      payload[camelize(`on ${name} Change`)] = onChangeHandlers[i]
      payload[camelize(`show ${name} Warning`)] = warnings[i]
      payload[camelize(`is ${name} valid`)] = valids[i]
    })
  } else {
    names.forEach((name) => {
      payload[camelize(name)] = ''
      payload[camelize(`on ${name} Change`)] = () => {}
      payload[camelize(`show ${name} Warning`)] = false
      payload[camelize(`is ${name} valid`)] = false
    })
  }
  return payload
}

const useFormState = ({ states, debug }) => {
  const [names] = useState(states.map((state) => state.name))
  const [values, setValues] = useState(states.map((state) => state.default))
  const [mandatory] = useState(states.map((state) => state.mustBeValid))
  const [validators] = useState(states.map((state) => state.validator))
  const [valids, setValids] = useState(states.map((state) => state.isValid))
  const [needValidations, setNeedValidations] = useState(
    states.map(() => false)
  )
  const [edits, setEdits] = useState(states.map(() => false))
  const [warnings, setWarnings] = useState(states.map(() => false))
  const [isValid, setIsValid] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

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
    setValues(states.map((state) => state.default))
    setValids(states.map((state) => state.isValid))
    setNeedValidations(states.map(() => false))
    setIsValid(false)
  }, [states])

  const resetState = useCallback(
    (index) => {
      setValues((prev) => {
        const arr = [...prev]
        arr[index] = states[index].default
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

  return {
    isValid,
    isValidating,
    triggerWarnings,
    triggerValidation,
    reset,
    resetStates,
    setStates,
    ...payload
  }
}

export default useFormState
