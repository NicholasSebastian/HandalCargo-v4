/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { MutableRefObject, useEffect } from 'react'
import styled from 'styled-components'

const LABEL_WIDTH = 160

interface HeadingProps {
  header: string
  description: string
}

export const Heading = (props: HeadingProps): JSX.Element => {
  return (
    <HeadingStyles>
      <h2>{props.header}</h2>
      <h5>{props.description}</h5>
    </HeadingStyles>
  )
}

const HeadingStyles = styled.div`
  > h2 {
    margin: 0;
    font-size: 18px;
  }

  > h5 {
    margin-top: 5px;
    margin-bottom: 25px;
    font-size: 14px;
    font-weight: normal;
  }
`

interface InputProps {
  label: string
  Ref: MutableRefObject<any>
  defaultValue?: string
  placeholder?: string
}

export const Input = (props: InputProps): JSX.Element => {
  return (
    <InputStyles>
      <label>{props.label}</label>
      <input
        type='text'
        ref={props.Ref}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder} />
    </InputStyles>
  )
}

const InputStyles = styled.div`
  display: grid;
  grid-template-columns: ${LABEL_WIDTH}px 1fr;
  > label {
    padding-top: 7.5px;
  }
`

interface DoubleInputProps {
  label: string
  Ref: MutableRefObject<any>
  Ref2: MutableRefObject<any>
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
        ref={props.Ref}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder} />
      <input
        type={props.password ? 'password' : 'text'}
        ref={props.Ref2}
        defaultValue={props.defaultValue2}
        placeholder={props.placeholder2} />
    </DoubleInputStyles>
  )
}

const DoubleInputStyles = styled.div`
  display: grid;
  grid-template-columns: ${LABEL_WIDTH}px 1fr 1fr;
  > label {
    padding-top: 7.5px;
  }
  > input:first-of-type {
    margin-right: 10px;
  }
`

interface DatePickerProps {
  label: string
  Ref: MutableRefObject<any>
  defaultValue: Date
}

export const DatePicker = (props: DatePickerProps): JSX.Element => {
  return (
    <DatePickerStyles>
      <label>{props.label}</label>
      <input
        type="date"
        ref={props.Ref}
        defaultValue={props.defaultValue?.toISOString().substr(0, 10)} />
    </DatePickerStyles>
  )
}

const DatePickerStyles = styled.div`
  > label {
    width: ${LABEL_WIDTH}px;
  }
`

interface ComboBoxProps {
  label: string
  Ref: MutableRefObject<any>
  options: Array<[string | number, string]> | null
  defaultValue: string
}

export const ComboBox = (props: ComboBoxProps): JSX.Element => {
  useEffect(() => { if (props.defaultValue) props.Ref.current.value = props.defaultValue }, [])
  return (
    <ComboBoxStyles>
      <label>{props.label}</label>
      <select ref={props.Ref}>
        {props.options?.map(([value, text], i) => {
          return <option key={i} value={value}>{text}</option>
        })}
      </select>
    </ComboBoxStyles>
  )
}

const ComboBoxStyles = styled.div`
  > label {
    width: ${LABEL_WIDTH}px;
  }
`
