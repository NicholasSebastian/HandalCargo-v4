/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useRef } from 'react'
import { ipcRenderer, remote } from 'electron'

import Table, { FilterFragmentProps } from './ComplexTable'
import Form, { FormFragmentProps } from './Form'

import { generateTableQuery, generateFormQueries } from '../functions/generateQueries'

const { dialog } = remote

const Template = (props: TemplateProps): JSX.Element => {

  const [mode, setMode] = useState<Mode>('Table')

  const formData = useRef<Array<unknown>>()
  const target = useRef<string>()

  const tableQuery = useRef(generateTableQuery(props.tableName, props.tableElements, props.tableQueryArgs))
  const formQuery = useRef(generateFormQueries(props.tableName, props.primaryKey, props.formElements))

  const returnToTable = () => setMode('Table')

  function insertQuery (formData: Array<unknown>) {
    ipcRenderer.send('queryNoReply', props.insertQuery || formQuery.current.insert, formData)
  }

  function updateQuery (formData: Array<unknown>) {
    dialog.showMessageBox({
      title: 'Update Record',
      message: 'Are you sure you want to modify this record?',
      buttons: ['Modify', 'Cancel']
    })
      .then(({ response }) => {
        if (response === 0) {
          ipcRenderer.send('queryNoReply', props.updateQuery || formQuery.current.update, [...formData, target.current])
        }
      })
  }

  return (() => {
    switch (mode) {
      case 'Add':
        return (
          <Form
            FormFragment={props.FormComponent}
            returnFunction={returnToTable}
            queryOnClick={insertQuery} />
        )
      case 'View':
        return (
          <Form
            FormFragment={props.FormComponent}
            returnFunction={returnToTable}
            initialData={formData.current} />
        )
      case 'Edit':
        return (
          <Form
            FormFragment={props.FormComponent}
            returnFunction={returnToTable}
            initialData={formData.current}
            queryOnClick={updateQuery} />
        )
      default:
        return (
          <Table // Jesus Christ why does this have an insane number of props
            id={props.tableName}
            columnNames={props.columnNames}
            primaryKey={props.primaryKey}
            tableQuery={tableQuery.current}
            deleteQuery={formQuery.current.delete}
            RowFragment={props.RowComponent}
            FilterFragment={props.FilterComponent}
            searchBy={props.searchBy}
            toAddPage={() => setMode('Add')}
            toViewPage={primaryKeyValue => {
              formData.current = Object.values(ipcRenderer.sendSync('querySync', formQuery.current.select, [primaryKeyValue])[0])
              setMode('View')
            }}
            toEditPage={primaryKeyValue => {
              formData.current = Object.values(ipcRenderer.sendSync('querySync', formQuery.current.select, [primaryKeyValue])[0])
              target.current = primaryKeyValue
              setMode('Edit')
            }} />
        )
    }
  })()
}

export default Template

type Mode = 'Table' | 'Add' | 'View' | 'Edit'

interface TemplateProps {
  tableName: string
  columnNames: Array<string>
  tableElements: Array<string>
  tableQueryArgs?: string
  insertQuery?: string
  updateQuery?: string
  formElements: Array<string>
  RowComponent: React.FunctionComponent<{ row: never }>
  FormComponent: React.FunctionComponent<FormFragmentProps>
  searchBy: string
  primaryKey: string
  FilterComponent: React.FunctionComponent<FilterFragmentProps>
}
