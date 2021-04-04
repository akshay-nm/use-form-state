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
