/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useRef } from 'react'
import { ipcRenderer, remote } from 'electron'

import Table, { FilterFragmentProps } from './ComplexTable'
import Form, { FormFragmentProps } from './Form'

const { dialog } = remote

const Template = ({
  id, columnNames,
  tableQuery, formQuery, insertQuery, updateQuery, deleteQuery,
  RowComponent, FormComponent, primaryKey, searchBy, FilterComponent
}: TemplateProps): JSX.Element => {

  const [mode, setMode] = useState<Mode>('Table')
  const selected = useRef<string>()

  return (() => {
    switch (mode) {
      case 'Add':
        return (
          <Form
            FormFragment={FormComponent}
            returnFunction={() => setMode('Table')}
            queryOnClick={formData => ipcRenderer.send('query', insertQuery, formData)} />
        )
      case 'View':
        return (
          <Form
            FormFragment={FormComponent}
            returnFunction={() => setMode('Table')}
            initialData={Object.values(ipcRenderer.sendSync('querySync', formQuery, [selected.current])[0])} />
        )
      case 'Edit':
        return (
          <Form
            FormFragment={FormComponent}
            returnFunction={() => setMode('Table')}
            initialData={Object.values(ipcRenderer.sendSync('querySync', formQuery, [selected.current])[0])}
            queryOnClick={formData => {
              dialog.showMessageBox({
                title: 'Update Record',
                message: 'Are you sure you want to modify this record?',
                buttons: ['Modify', 'Cancel']
              })
                .then(({ response }) => {
                  if (response === 0) {
                    ipcRenderer.send('query', updateQuery, [...formData, selected.current])
                  }
                })
            }} />
        )
      default:
        return (
          <Table
            id={id}
            columnNames={columnNames}
            tableQuery={tableQuery}
            RowFragment={RowComponent}
            primaryKey={primaryKey}
            searchBy={searchBy}
            FilterFragment={FilterComponent}
            deleteQuery={deleteQuery}
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
  id: string
  columnNames: Array<string>
  tableQuery: string
  formQuery: string
  insertQuery: string
  updateQuery: string
  deleteQuery: string
  RowComponent: React.FunctionComponent<{ row: never }>
  FormComponent: React.FunctionComponent<FormFragmentProps>
  searchBy: string
  primaryKey: string
  FilterComponent: React.FunctionComponent<FilterFragmentProps>
}
