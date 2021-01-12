/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState } from 'react'
import styled from 'styled-components'

const Form = ({ FormFragment, returnFunction, initialData, queryOnClick }: FormProps): JSX.Element => {
  const [formData, setFormData] = useState<Array<string>>(initialData || [])

  function handleSave () {
    queryOnClick!(formData)
    returnFunction()
  }

  return (
    <StyledFormArea editable={queryOnClick !== undefined}>
      <div>
        <FormFragment // All form elements should reflect the formData state.
          formData={formData}
          setFormData={setFormData} />
        {queryOnClick && <button onClick={handleSave}>Save</button>}
        <button onClick={returnFunction}>Cancel</button>
      </div>
    </StyledFormArea>
  )
}

export default Form

const StyledFormArea = styled.div<{ editable: boolean }>`
  height: 100%;
  padding: 20px;

  > div {
    background-color: ${({ theme }) => theme.bg};
    border-radius: 5px;
    padding: 15px;
    box-shadow: 0 0 5px ${({ theme }) => theme.fgWeak};

    input { 
      pointer-events: ${({ editable }) => editable ? 'auto' : 'none'}; 
    }

    > button {
      background-color: ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.bg};
      border: none;
      border-radius: 5px;
      width: 70px;
      padding: 10px 0;
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
}
