# @akshay-nm/use-form-state

> A hook to help you manage your form state declaratively.

[![NPM](https://img.shields.io/npm/v/@akshay-nm/use-form-state.svg)](https://www.npmjs.com/package/@akshay-nm/use-form-state) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @akshay-nm/use-form-state
```

## Usage

```jsx
import React from 'react'

import Login from './Login'

const App = () => {
  return <Login />
}

export default App
```

```jsx
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
```

```jsx
import React, { useCallback } from 'react'
import useLoginFormState from './useLoginFormState'

const Login = () => {
  const [
    formIsValid,
    isValidating,
    resetForm,
    email,
    showEmailWarning,
    onEmailChange,
    password,
    showPasswordWarning,
    onPasswordChange
  ] = useLoginFormState()

  const login = useCallback(() => {
    console.log('Send login request, form is valid: ', formIsValid)
  }, [formIsValid])

  return (
    <div className='p-4'>
      <div className='text-lg font-bold mb-2'>Login</div>
      <div className='mb-2'>
        <div>Email</div>
        <div>
          <input
            className={`px-2 py-1 border rounded focus:bg-gray-300  ${
              showEmailWarning ? 'border-red-400' : ''
            }`}
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />
        </div>
        {showEmailWarning && (
          <div className='text-xs text-red-400'>
            Please enter a valid email address.
          </div>
        )}
      </div>
      <div className='mb-2'>
        <div>Password</div>
        <div>
          <input
            className={`px-2 py-1 border rounded focus:bg-gray-300  ${
              showPasswordWarning ? 'border-red-400' : ''
            }`}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            type='password'
          />
        </div>
        {showPasswordWarning && (
          <div className='text-xs text-red-400'>Please enter a password.</div>
        )}
      </div>
      <div className='mb-2'>
        <button
          className={`px-2 py-1 border rounded mr-2`}
          onClick={login}
          disabled={isValidating}
        >
          Login
        </button>
        <button
          className={`px-2 py-1 border rounded`}
          onClick={resetForm}
          disabled={isValidating}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default Login
```

## License

MIT © [akshay-nm](https://github.com/akshay-nm)
