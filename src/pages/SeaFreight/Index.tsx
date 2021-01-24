import React from 'react'

import Template from '../../components/ComplexTemplate'
import { generateTableQuery, generateFormQueries } from '../../functions/generateQueries'

const tableColumnNames = ['']
const tableElements = ['']

const formElements = ['']

const tableQuery = generateTableQuery()
const formQueries = generateFormQueries()

const AirCargo = (): JSX.Element => {
  return (
    <Template id=''
      tableQuery={tableQuery}
      formQuery={formQueries.select}
      insertQuery={formQueries.insert}
      updateQuery={formQueries.update}
      deleteQuery={formQueries.delete}
      primaryKey=''
      searchBy=''
      columnNames={tableColumnNames}
      RowComponent={}
      FormComponent={}
      FilterComponent={} />
  )
}

export default AirCargo
