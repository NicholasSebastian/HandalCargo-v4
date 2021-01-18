/* eslint-disable quotes */
import React from 'react'

import Template from '../../components/ComplexTemplate'

import Row from './Row'
import Filter from './Filter'
import Form from './Form'

const tableColumnNames = ['Staff ID', 'Full Name', 'Job', 'Phone Number', 'Status']
const tableElements = [`staffid`, `staffname`, `groupname`, `phonenum`, `status`]
const tableQueryArgs = 'LEFT JOIN `staffgroup` ON `staff`.`groupcode` = `staffgroup`.`stfgrcode`'

const formElements = [
  'staffid', 'pwd', 'pwd_iv', 'pwd_salt', 'level', 'profilepic', 'profilepictype', 'groupcode', 'staffname',
  'gender', 'phonenum', 'placeofbirth', 'dateofbirth', 'status', 'dateofemployment',
  'address1', 'district', 'city', 'salary', 'ot/hr', 'foodallowance', 'bonus', 'dilligencebonus'
]

const Staff = (): JSX.Element => {
  return (
    <Template
      tableName='staff'
      primaryKey='staffid'
      searchBy='staffname'
      columnNames={tableColumnNames}
      tableElements={tableElements}
      tableQueryArgs={tableQueryArgs}
      formElements={formElements}
      // TODO: custom insertQuery and updateQuery here, wrap image buffer queries with BINARY()
      RowComponent={Row}
      FormComponent={Form}
      FilterComponent={Filter} />
  )
}

export default Staff
