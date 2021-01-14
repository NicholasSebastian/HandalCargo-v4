/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useEffect, useRef, Fragment } from 'react'
import { ipcRenderer } from 'electron'

import { FormFragmentProps } from '../../components/Form'
import { Heading, Input, DoubleInput, ComboBox, DatePicker } from '../../components/FormComponents'

const Form = ({ formData, setFormData, setOnSubmit }: FormFragmentProps): JSX.Element => {
  useEffect(() => {
    configureSubmit()
    fetchGroups()
  }, [])

  // Prepare the data to be sent to the database.
  function configureSubmit () {
    setOnSubmit(() =>
      () => {
        const errors: Array<string> = []
        if (staffIdRef.current!.value.length === 0) errors.push('Staff ID cannot be blank.')
        if (firstNameRef.current!.value.length + lastNameRef.current!.value.length === 0) errors.push('Name cannot be blank.')
        if (passwordRef.current!.value.length === 0 || passwordRef2.current!.value.length === 0) errors.push('Passwords cannot be blank.')
        if (passwordRef.current!.value !== passwordRef2.current!.value) errors.push('Passwords do not match.')
        if (errors.length > 0) return errors

        const fullName = `${firstNameRef.current!.value} ${lastNameRef.current!.value}`
        const encryptedPassword = passwordRef.current!.value // TODO: encrypt password

        setFormData([
          // TODO: profile pic blob here
          staffIdRef.current!.value,
          encryptedPassword,
          accessLevelRef.current!.value,

          staffGroupRef.current!.value,
          fullName,
          genderRef.current!.value,
          phoneNumRef.current!.value,
          birthPlaceRef.current!.value,
          birthdayRef.current!.value,
          statusRef.current!.value,
          employmentDateRef.current!.value,

          addressRef.current!.value,
          districtRef.current!.value,
          cityRef.current!.value,

          salaryRef.current!.value,
          overtimePayRef.current!.value,
          mealAllowanceRef.current!.value,
          bonusPayRef.current!.value,
          extraBonusPayRef.current!.value
        ])
        return 'ok' as const
      }
    )
  }

  // Prepare data for the Form UI
  const staffName = getFirstLastName(formData[5])

  const [staffGroup, setStaffGroup] = useState<Array<StaffGroup> | null>(null)
  function fetchGroups () {
    ipcRenderer.once('staffFormQuery', (event, data) => { setStaffGroup(data) })
    ipcRenderer.send('query', 'SELECT `stfgrcode`, `groupname` FROM `staffgroup`', [], 'staffFormQuery')
  }

  // Form UI Elements
  const staffIdRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordRef2 = useRef<HTMLInputElement>(null)
  const accessLevelRef = useRef<HTMLSelectElement>(null)

  const staffGroupRef = useRef<HTMLSelectElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const genderRef = useRef<HTMLSelectElement>(null)
  const phoneNumRef = useRef<HTMLInputElement>(null)
  const birthPlaceRef = useRef<HTMLInputElement>(null)
  const birthdayRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLSelectElement>(null)
  const employmentDateRef = useRef<HTMLInputElement>(null)

  const addressRef = useRef<HTMLInputElement>(null)
  const districtRef = useRef<HTMLInputElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)

  const salaryRef = useRef<HTMLInputElement>(null)
  const overtimePayRef = useRef<HTMLInputElement>(null)
  const mealAllowanceRef = useRef<HTMLInputElement>(null)
  const bonusPayRef = useRef<HTMLInputElement>(null)
  const extraBonusPayRef = useRef<HTMLInputElement>(null)

  // TODO: Images. Pick image from file system, convert to BLOB/Binary64, store in DB, vice versa.
  return (
    <Fragment>
      <h1>Staff Details</h1>
      <Heading header="Account Details" description="uhhh your account stuff" />
      <Input label="Staff ID" Ref={staffIdRef} defaultValue={formData[1]} placeholder='e.g. jacky123' />
      <DoubleInput label="Password" Ref={passwordRef} Ref2={passwordRef2}
        placeholder="Password" placeholder2="Confirm Password" password={true} />
      <ComboBox label="Access Level" Ref={accessLevelRef} defaultValue={formData[3]}
        options={[[1, 'Employee'], [2, 'Manager'], [3, 'Master']]} />
      <hr />
      <Heading header="Personal Information" description="idk what the description should be" />
      <ComboBox label="Staff Group" Ref={staffGroupRef} defaultValue={formData[4]}
        options={staffGroup ? staffGroup.map(object => Object.values(object) as [string, string]) : null} />
      <DoubleInput label="Full Name" Ref={firstNameRef} Ref2={lastNameRef}
        defaultValue={staffName.firstName}
        defaultValue2={staffName.lastName}
        placeholder='First Name' placeholder2='Last Name' />
      <ComboBox label="Gender" Ref={genderRef} defaultValue={formData[6]}
        options={[[0, 'Male'], [1, 'Female']]} />
      <Input label="Phone Number" Ref={phoneNumRef} defaultValue={formData[7]} placeholder='e.g. +6281234567890' />
      <Input label="Place of Birth" Ref={birthPlaceRef} defaultValue={formData[8]} />
      <DatePicker label="Date of Birth" Ref={birthdayRef} defaultValue={formData[9] as unknown as Date} />
      <ComboBox label="Status" Ref={statusRef} defaultValue={formData[10]}
        options={[[1, 'Active'], [0, 'Inactive']]} />
      <DatePicker label="Date of Employment" Ref={employmentDateRef} defaultValue={formData[11] as unknown as Date} />
      <hr />
      <Heading header="Address" description="Where the dude or gal lives" />
      <Input label="Address" Ref={addressRef} defaultValue={formData[12]} placeholder="e.g. Katamaran Indah, Blok ABC No.123" />
      <Input label="District" Ref={districtRef} defaultValue={formData[13]} placeholder="e.g. Pantai Indah Kapuk" />
      <Input label="City" Ref={cityRef} defaultValue={formData[14]} placeholder="e.g. Jakarta Utara" />
      <hr />
      <Heading header="Salary and Wages" description="The staff's periodical pay amount." />
      <Input label="Salary" Ref={salaryRef} defaultValue={formData[15]} placeholder='e.g. 5,000,000' />
      <Input label="Overtime Pay" Ref={overtimePayRef} defaultValue={formData[16]} />
      <Input label="Meal Allowance" Ref={mealAllowanceRef} defaultValue={formData[17]} />
      <Input label="Bonus Pay" Ref={bonusPayRef} defaultValue={formData[18]} />
      <Input label="Extra Bonus Pay" Ref={extraBonusPayRef} defaultValue={formData[19]} />
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
