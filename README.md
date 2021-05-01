# @akshay-nm/use-form-state

> A hook to help you manage your form state declaratively.

[![NPM](https://img.shields.io/npm/v/@akshay-nm/use-form-state.svg)](https://www.npmjs.com/package/@akshay-nm/use-form-state) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

### Getting started + Motivation behind this hook on medium:
**Read this:** https://medium.com/sdiot-technologies/akshay-nm-use-form-state-23d8406af540

## Install

```bash
npm install --save @akshay-nm/use-form-state
```

## Usage

### Configuration

The hook takes an object as configuration. Let's assume `config` is the configuration object to be passed to the hook.

For each form field, you need:

- value
- onChangeHandler
- showWarning

To generate these, the hook needs:

- name of the field
- default value of the field
- validator
- is the field valid by default
- is this field mandatory (should the field affect the overall form validity or not)

So for each field you have to pass configuration:

```jsx
{
  name: 'nameInCamelCase', // Although I have added a camelize check but still...
  default: '', // the default value of field
  defaultIsValid: false, // is the field valid by default
  mustBeValid: true, // is the field mandatory
  validator: (value) => true // the validator
},
```

You pass the fields as an array named `states`.

```jsx
const config = {
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
  ],
  debug: false // if you want logs
}
```

## Complete example

```jsx
import React from 'react'

import Login from './Login'

const App = () => {
  return <Login />
}

export default App
```

```jsx
import React, { useCallback } from 'react'
import useLoginFormState from '@akshay-nm/use-form-state'

const Login = () => {
  const {
    isValid: formIsValid,
    isValidating,
    resetForm,
    email,
    showEmailWarning,
    onEmailChange,
    password,
    showPasswordWarning,
    onPasswordChange
  } = useFormState({
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
    ],
    debug: false
  })

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
