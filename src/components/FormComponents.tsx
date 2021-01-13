/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { MutableRefObject } from 'react'
import styled from 'styled-components'

const LABEL_WIDTH = 140

interface InputProps {
  label: string
  ref: MutableRefObject<any>
  defaultValue?: string
  placeholder?: string
}

export const Input = (props: InputProps): JSX.Element => {
  return (
    <InputStyles>
      <label>{props.label}</label>
      <input
        type='text'
        ref={props.ref}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder} />
    </InputStyles>
  )
}

const InputStyles = styled.div`
  > label {
    display: inline-block;
    width: ${LABEL_WIDTH}px;
  }
`

interface DoubleInputProps {
  label: string
  ref: MutableRefObject<any>
  ref2: MutableRefObject<any>
  defaultValue?: string
  defaultValue2?: string
  placeholder?: string
  placeholder2?: string
  password?: boolean
}

export const DoubleInput = (props: DoubleInputProps): JSX.Element => {
  return (
    <DoubleInputStyles>
      <label>{props.label}</label>
      <input
        type={props.password ? 'password' : 'text'}
        ref={props.ref}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder} />
      <input
        type={props.password ? 'password' : 'text'}
        ref={props.ref2}
        defaultValue={props.defaultValue2}
        placeholder={props.placeholder2} />
    </DoubleInputStyles>
  )
}

const DoubleInputStyles = styled.div`
  > label {
    display: inline-block;
    width: ${LABEL_WIDTH}px;
  }
`

interface ComboBoxProps {
  label: string
  ref: MutableRefObject<any>
  options: Array<[string, string]> | null
}

export const ComboBox = (props: ComboBoxProps): JSX.Element => {
  return (
    <ComboBoxStyles>
      <label>{props.label}</label>
      <select ref={props.ref}>
        {props.options?.map(([value, text], i) => {
          return <option key={i} value={value}>{text}</option>
        })}
      </select>
    </ComboBoxStyles>
  )
}

const ComboBoxStyles = styled.div`
  > label {
    display: inline-block;
    width: ${LABEL_WIDTH}px;
  }
`
