/* eslint-disable quotes */

import React from 'react'

import Template from '../../components/ComplexTemplate'
import { generateTableQuery, generateFormQueries } from '../../functions/generateQueries'

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

const tableQuery = generateTableQuery('staff', tableElements, tableQueryArgs)
const formQueries = generateFormQueries('staff', 'staffid', formElements)

// const insertQuery = `INSERT INTO \`staff\` (\`${formElements.join('`, `')}\`) VALUES (?, ?, ?, ?, ?, BUFFER(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
// const updateQuery = `UPDATE \`staff\` SET \`${formElements.slice(0, 5).join('` = ?, `')}\` = ?, \`profilepic\` = BUFFER(?), \`${formElements.slice(6).join('` = ?, `')}\` = ? WHERE \`staffid\` = ?`

const Staff = (): JSX.Element => {
  return (
    <Template id='staff'
      tableQuery={tableQuery}
      formQuery={formQueries.select}
      insertQuery={formQueries.insert}
      updateQuery={formQueries.update}
      deleteQuery={formQueries.delete}
      primaryKey='staffid'
      searchBy='staffname'
      columnNames={tableColumnNames}
      RowComponent={Row}
      FormComponent={Form}
      FilterComponent={Filter} />
  )
}

export default Staff
