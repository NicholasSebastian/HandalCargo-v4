/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useRef } from 'react'
import { ipcRenderer, remote } from 'electron'

import Table, { FilterFragmentProps } from './ComplexTable'
import Form, { FormFragmentProps } from './Form'

import { generateTableQuery, generateFormQueries } from '../functions/generateQueries'

const { dialog } = remote

const Template = ({
  tableName, columnNames,
  tableElements, tableQueryArgs, formElements,
  RowComponent, FormComponent, primaryKey, searchBy, FilterComponent
}: TemplateProps): JSX.Element => {

  const tableQuery = useRef(generateTableQuery(tableName, tableElements, tableQueryArgs))
  const formQuery = useRef(generateFormQueries(tableName, primaryKey, formElements))

  const [mode, setMode] = useState<Mode>('Table')
  const selected = useRef<string>()

  return (() => {
    switch (mode) {
      case 'Add':
        return (
          <Form
            FormFragment={FormComponent}
            returnFunction={() => setMode('Table')}
            queryOnClick={formData => ipcRenderer.send('queryNoReply', formQuery.current.insert, formData)} />
        )
      case 'View':
        return (
          <Form
            FormFragment={FormComponent}
            returnFunction={() => setMode('Table')}
            initialData={Object.values(ipcRenderer.sendSync('querySync', formQuery.current.select, [selected.current])[0])} />
        )
      case 'Edit':
        return (
          <Form
            FormFragment={FormComponent}
            returnFunction={() => setMode('Table')}
            initialData={Object.values(ipcRenderer.sendSync('querySync', formQuery.current.select, [selected.current])[0])}
            queryOnClick={formData => {
              dialog.showMessageBox({
                title: 'Update Record',
                message: 'Are you sure you want to modify this record?',
                buttons: ['Modify', 'Cancel']
              })
                .then(({ response }) => {
                  if (response === 0) {
                    ipcRenderer.send('queryNoReply', formQuery.current.update, [...formData, selected.current])
                  }
                })
            }} />
        )
      default:
        return (
          <Table
            id={tableName}
            columnNames={columnNames}
            tableQuery={tableQuery.current}
            RowFragment={RowComponent}
            primaryKey={primaryKey}
            searchBy={searchBy}
            FilterFragment={FilterComponent}
            deleteQuery={formQuery.current.delete}
            toAddPage={() => setMode('Add')}
            toViewPage={primaryKeyValue => {
              selected.current = primaryKeyValue
              setMode('View')
            }}
            toEditPage={primaryKeyValue => {
              selected.current = primaryKeyValue
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
  formElements: Array<string>
  RowComponent: React.FunctionComponent<{ row: never }>
  FormComponent: React.FunctionComponent<FormFragmentProps>
  searchBy: string
  primaryKey: string
  FilterComponent: React.FunctionComponent<FilterFragmentProps>
}
