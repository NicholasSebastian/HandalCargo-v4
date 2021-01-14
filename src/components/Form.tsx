/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useContext } from 'react'
import styled from 'styled-components'

import { ScrollControl } from './Layout'

const Form = ({ FormFragment, returnFunction, initialData, queryOnClick }: FormProps): JSX.Element => {
  const scrollToTop = useContext(ScrollControl)!

  const [formData, setFormData] = useState<Array<string>>(initialData || [])

  const [onSubmit, setOnSubmit] = useState<() => 'ok' | Array<string>>()
  const [errorMessages, setErrorMessages] = useState<Array<string> | null>(null)

  function handleSave () {
    if (onSubmit) {
      const error = onSubmit()
      if (error === 'ok') setErrorMessages(null)
      else {
        setErrorMessages(error)
        scrollToTop()
        return
      }
    }
    queryOnClick!(formData)
    returnFunction()
  }

  return (
    <StyledFormArea editable={queryOnClick !== undefined}>
      <div>
        {errorMessages &&
          <StyledError>
            {errorMessages.map((errorMessage, i) => <li key={i}>{errorMessage}</li>)}
          </StyledError>
        }
        <FormFragment // All form elements should reflect the formData state.
          formData={formData}
          setFormData={setFormData}
          setOnSubmit={setOnSubmit} />
        <div>
          {queryOnClick && <button onClick={handleSave}>Save</button>}
          <button onClick={returnFunction}>Back</button>
        </div>
      </div>
    </StyledFormArea>
  )
}

export default Form

const StyledFormArea = styled.div<{ editable: boolean }>`
  height: 100%;

  > div {
    background-color: ${({ theme }) => theme.bg};
    border-radius: 5px;
    margin: 20px;
    padding: 25px;
    box-shadow: 0 0 5px ${({ theme }) => theme.fgWeak};

    h1, h2 {
      color: ${({ theme }) => theme.fgStrong};
    }

    h5 {
      color: ${({ theme }) => theme.fgMid};
    }

    h1 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 24px;
    }

    label {
      color: ${({ theme }) => theme.fgStrong};
      display: inline-block;
      padding-right: 15px;
      font-size: 13px;
      font-weight: bolder;
      text-align: right;
    }

    select {
      color: ${({ theme }) => theme.fgStrong};
      appearance: ${({ editable }) => editable ? 'auto' : 'none'};

      &:hover {
        cursor: ${({ editable }) => editable ? 'pointer' : 'default'};
      }
    }

    input[type="date"] {
      &::-webkit-inner-spin-button { display: none; }

      &:hover {
        cursor: text;
      }

      &::-webkit-calendar-picker-indicator:hover { 
        cursor: pointer; 
      }
    }

    input, select { 
      pointer-events: ${({ editable }) => editable ? 'auto' : 'none'};
      background-color: ${({ theme }) => theme.fgWeak};
      border: 1px solid transparent;
      border-radius: 5px;
      padding: 8px 12px;
      font-size: 12px;

      &::placeholder {
        visibility: ${({ editable }) => editable ? 'visible' : 'hidden'};
      }

      &:focus {
        border-color: ${({ theme }) => theme.accent};
        outline: none;
      }
    }

    hr {
      margin: 25px 0;
    }

    > div:not(:last-child) {
      margin-bottom: 15px;
    }

    > div:last-child {
      text-align: right;

      > button {
        background-color: ${({ theme }) => theme.accent};
        color: ${({ theme }) => theme.bg};
        border: none;
        border-radius: 5px;
        width: 70px;
        padding: 10px 0;
        margin-top: 20px;
        margin-left: 10px;

        &:hover {
          cursor: pointer;
          // add hover effects here
        }
      }
    }
  }
`

const StyledError = styled.ul`
  color: ${({ theme }) => theme.red};
  border: 1px solid ${({ theme }) => theme.red};
  border-radius: 5px;
  padding: 10px 40px;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 13px;
`

interface FormProps {
  FormFragment: React.FunctionComponent<FormFragmentProps>
  returnFunction: () => void
  initialData?: Array<string>
  queryOnClick?: (formData: Array<string>) => void
}

export interface FormFragmentProps {
  formData: Array<string>
  setFormData: React.Dispatch<React.SetStateAction<string[]>>
  setOnSubmit: React.Dispatch<React.SetStateAction<(() => Array<string> | 'ok') | undefined>>
}
