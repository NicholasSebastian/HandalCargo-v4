/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState } from 'react'
import styled from 'styled-components'

const Form = ({ FormFragment, returnFunction, initialData, queryOnClick }: FormProps): JSX.Element => {
  const [formData, setFormData] = useState<Array<string>>(initialData || [])
  const [onSubmit, setOnSubmit] = useState<() => void>()

  function handleSave () {
    if (onSubmit) onSubmit()
    queryOnClick!(formData)
    returnFunction()
  }

  return (
    <StyledFormArea editable={queryOnClick !== undefined}>
      <div>
        <FormFragment // All form elements should reflect the formData state.
          formData={formData}
          setFormData={setFormData}
          setOnSubmit={setOnSubmit} />
        {queryOnClick && <button onClick={handleSave}>Save</button>}
        <button onClick={returnFunction}>Back</button>
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
      appearance: ${({ editable }) => editable ? 'auto' : 'none'};

      &:hover {
        cursor: ${({ editable }) => editable ? 'pointer' : 'default'};
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

    > div {
      margin-bottom: 15px;
    }

    > button {
      background-color: ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.bg};
      border: none;
      border-radius: 5px;
      width: 70px;
      padding: 10px 0;
      margin-top: 20px;
      margin-right: 10px;

      &:hover {
        cursor: pointer;
        // add hover effects here
      }
    }
  }
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
  setOnSubmit: React.Dispatch<React.SetStateAction<(() => void) | undefined>>
}
