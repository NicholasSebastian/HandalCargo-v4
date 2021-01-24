import React, { useState, useEffect, useRef, Fragment } from 'react'
import { ipcRenderer } from 'electron'

import { FormFragmentProps } from '../../components/Form'
import { Heading, Input, DoubleInput, ComboBox, DatePicker, ImagePicker, ImageBuffer } from '../../components/FormComponents'

import getFirstLastName from '../../functions/splitName'

const Form = ({ formData, setOnSubmit }: FormFragmentProps): JSX.Element => {
  useEffect(configureSubmit, [])

  function configureSubmit () {
    setOnSubmit(() =>
      () => {
        // stuff here
      }
    )
  }

  const customerIdRef = useRef<HTMLInputElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const companyRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)
  const dateAddedRef = useRef<HTMLInputElement>(null)

  const address1Ref = useRef<HTMLInputElement>(null)
  const city1Ref = useRef<HTMLInputElement>(null)
  const postalCode1Ref = useRef<HTMLInputElement>(null)
  const address2Ref = useRef<HTMLInputElement>(null)
  const city2Ref = useRef<HTMLInputElement>(null)
  const postalCode2Ref = useRef<HTMLInputElement>(null)

  const officePhone1Ref = useRef<HTMLInputElement>(null)
  const officePhone2Ref = useRef<HTMLInputElement>(null)
  const mobilePhone1Ref = useRef<HTMLInputElement>(null)
  const mobilePhone2Ref = useRef<HTMLInputElement>(null)
  const homePhoneRef = useRef<HTMLInputElement>(null)
  const faxRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const contactPerson1Ref = useRef<HTMLInputElement>(null)
  const contactPerson2Ref = useRef<HTMLInputElement>(null)

  const sizeDescRef = useRef<HTMLInputElement>(null)
  const courierDescRef = useRef<HTMLSelectElement>(null)
  const othersRef = useRef<HTMLInputElement>(null)

  return (
    <Fragment>
      <Heading header="Customer Details" description="Information about the customer and stuff." />
    </Fragment>
  )
}

export default Form
