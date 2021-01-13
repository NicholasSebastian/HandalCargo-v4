/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useEffect, useRef, Fragment } from 'react'
import { ipcRenderer } from 'electron'
import { FormFragmentProps } from '../../components/Form'
import { Input, DoubleInput, ComboBox } from '../../components/FormComponents'

const Form = ({ formData, setFormData, setOnSubmit }: FormFragmentProps): JSX.Element => {
  useEffect(() => {
    onSubmit()
    fetchGroups()
  }, [])

  // Processing/formatting the data before it is sent to the insert query.
  function onSubmit () {
    setOnSubmit(() =>
      () => {
        setFormData([
          staffIdRef.current!.value,
          firstNameRef.current!.value,
          lastNameRef.current!.value
        ])
      }
    )
  }

  // Data for the form //

  const staffName = getFirstLastName(formData[2])

  const [staffGroup, setStaffGroup] = useState<Array<StaffGroup> | null>(null)
  function fetchGroups () {
    ipcRenderer.once('staffFormQuery', (event, data) => { setStaffGroup(data) })
    ipcRenderer.send('query', 'SELECT `stfgrcode`, `groupname` FROM `staffgroup`', [], 'staffFormQuery')
  }

  // The actual form UI elements //

  const staffIdRef = useRef<HTMLInputElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const staffGroupRef = useRef<HTMLSelectElement>(null)

  return (
    <Fragment>
      <Input label="Staff ID" ref={staffIdRef} defaultValue={formData[1]} placeholder='e.g. jacky123' />
      <DoubleInput label="Full Name" ref={firstNameRef} ref2={lastNameRef}
        defaultValue={staffName.firstName}
        defaultValue2={staffName.lastName}
        placeholder='First Name' placeholder2='Last Name' />
      <ComboBox label="Staff Group" ref={staffGroupRef} options={staffGroup ? staffGroup.map(object => Object.values(object) as [string, string]) : null} />
    </Fragment>
  )
}

export default Form

function getFirstLastName (fullName: string): FullName {
  return fullName && fullName.includes(' ')
    ? {
      firstName: fullName.substr(0, fullName.lastIndexOf(' ')),
      lastName: fullName.substr(fullName.lastIndexOf(' ') + 1)
    }
    : {
      firstName: fullName,
      lastName: ''
    }
}

interface StaffGroup {
  stfgrcode: string,
  groupname: string
}

interface FullName {
  firstName: string
  lastName: string
}
