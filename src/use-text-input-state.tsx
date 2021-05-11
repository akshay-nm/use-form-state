import { useCallback, useEffect, useState } from 'react'

type TextValidator = (x: string) => boolean
type ChangeHandler = (x: string) => void

interface TextInputConfig {
  name: string
  defaultValue: string
  defaultIsValid: boolean
  validator: TextValidator
}

interface TextInputReturnType {
  value: string
  isValid: boolean
  showWarning: boolean
  onChange: ChangeHandler
}

export const useTextInputState = ({
  defaultIsValid,
  defaultValue,
  validator
}: TextInputConfig) => {
  const [value, setValue] = useState<string>(defaultValue || '')
  const [wasEdited, setWasEdited] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<boolean>(defaultIsValid || true)
  const [needsValidation, setNeedsValidation] = useState<boolean>(false)
  const [shouldShowWarning, setShouldShowWarning] = useState<boolean>(false)
  const onChangeHandler = useCallback((val) => {
    setValue(val)
    setWasEdited(true)
    setNeedsValidation(true)
  }, [])

  useEffect(() => {
    if (needsValidation) {
      setIsValid(validator ? validator(value) : true)
      setNeedsValidation(false)
    }
  }, [needsValidation, value])

  useEffect(() => {
    setShouldShowWarning(!needsValidation && !isValid && wasEdited)
  }, [needsValidation, isValid, wasEdited])

  const returned: TextInputReturnType = {
    value,
    isValid,
    showWarning: shouldShowWarning,
    onChange: onChangeHandler
  }
  return returned
}
