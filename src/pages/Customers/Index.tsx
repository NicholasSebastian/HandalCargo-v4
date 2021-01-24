import React from 'react'

import Template from '../../components/ComplexTemplate'
import { generateTableQuery, generateFormQueries } from '../../functions/generateQueries'

import Row from './Row'
import Form from './Form'
import Filter from './Filter'

const tableColumnNames = ['Customer ID', 'Full Name', 'Email', 'Status']
const tableElements = ['customerid', 'customername', 'email', 'status']

const formElements = [
  'customerid', 'customername', 'company', 'status',
  'address1', 'city1', 'postalcode1', 'address2', 'city2', 'postalcode2',
  'officephone1', 'officephone2', 'mobilephone1', 'mobilephone2', 'homephone',
  'fax', 'email', 'contactperson1', 'contactperson2',
  'sizedesc', 'courierdesc', 'others', 'dateadded'
]

const tableQuery = generateTableQuery('customers', tableElements)
const formQueries = generateFormQueries('customers', 'customerid', formElements)

const Customers = (): JSX.Element => {
  return (
    <Template id=''
      tableQuery={tableQuery}
      formQuery={formQueries.select}
      insertQuery={formQueries.insert}
      updateQuery={formQueries.update}
      deleteQuery={formQueries.delete}
      primaryKey='customerid'
      searchBy='customername'
      columnNames={tableColumnNames}
      RowComponent={Row}
      FormComponent={Form}
      FilterComponent={Filter} />
  )
}

export default Customers
