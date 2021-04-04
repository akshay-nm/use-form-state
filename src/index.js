import { useCallback, useEffect, useState } from 'react'

const useFormState = (spec, debug = false) => {
  const [names] = useState(spec.states.map((state) => state.name))
  const [values, setValues] = useState(
    spec.states.map((state) => state.default)
  )
  const [mandatory] = useState(spec.states.map((state) => state.mustBeValid))
  const [validators] = useState(spec.states.map((state) => state.validator))
  const [valids, setValids] = useState(
    spec.states.map((state) => state.isValid)
  )
  const [needValidations, setNeedValidations] = useState(
    spec.states.map(() => false)
  )
  const [edits, setEdits] = useState(spec.states.map(() => false))
  const [warnings, setWarnings] = useState(spec.states.map(() => false))
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
    setValues(spec.states.map((state) => state.default))
    setValids(spec.states.map((state) => state.isValid))
    setNeedValidations(spec.states.map(() => false))
    setIsValid(false)
  }, [spec])

  const resetState = useCallback(
    (index) => {
      setValues((prev) => {
        const arr = [...prev]
        arr[index] = spec.states[index].default
        return arr
      })
      setValids((prev) => {
        const arr = [...prev]
        arr[index] = spec.states[index].defaultIsValid
        return arr
      })
      setNeedValidations((prev) => {
        const arr = [...prev]
        arr[index] = false
        return arr
      })
    },
    [spec]
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
    spec.states.map((state, index) => (value) => onChangeHandler(index, value))
  )
  const [resetStates] = useState(
    spec.states.map((state, index) => () => resetState(index))
  )
  const [setStates] = useState(
    spec.states.map((state, index) => (value, isValid, needsValidation) =>
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

  return [
    isValid,
    isValidating,
    values,
    warnings,
    onChangeHandlers,
    triggerWarnings,
    triggerValidation,
    reset,
    resetStates,
    setStates,
    names
  ]
}

export default useFormState
