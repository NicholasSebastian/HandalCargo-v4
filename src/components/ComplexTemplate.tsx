/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useRef } from 'react'
import { ipcRenderer, remote } from 'electron'

import Table, { RowFragmentProps, FilterFragmentProps } from './ComplexTable'
import Form, { FormFragmentProps } from './Form'

const { dialog } = remote

const Template = (props: TemplateProps): JSX.Element => {
  const [mode, setMode] = useState<Mode>('Table')

  const formData = useRef<Array<unknown>>()
  const target = useRef<string>()

  const returnToTable = () => setMode('Table')

  function insertQuery (formData: Array<unknown>) {
    ipcRenderer.send('queryNoReply', props.insertQuery, formData)
  }

  function updateQuery (formData: Array<unknown>) {
    dialog.showMessageBox({
      title: 'Update Record',
      message: 'Are you sure you want to modify this record?',
      buttons: ['Modify', 'Cancel']
    })
      .then(({ response }) => {
        if (response === 0) {
          ipcRenderer.send('queryNoReply', props.updateQuery, [...formData, target.current])
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
            id={props.id}
            view={mode}
            columnNames={props.columnNames}
            primaryKey={props.primaryKey}
            tableQuery={props.tableQuery}
            deleteQuery={props.deleteQuery}
            RowFragment={props.RowComponent}
            FilterFragment={props.FilterComponent}
            searchBy={props.searchBy}
            toAddPage={() => setMode('Add')}
            toViewPage={primaryKeyValue => {
              formData.current = Object.values(ipcRenderer.sendSync('querySync', props.formQuery, [primaryKeyValue])[0])
              setMode('View')
            }}
            toEditPage={primaryKeyValue => {
              formData.current = Object.values(ipcRenderer.sendSync('querySync', props.formQuery, [primaryKeyValue])[0])
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
  id: string
  tableQuery: string,
  formQuery: string
  insertQuery: string
  updateQuery: string
  deleteQuery: string
  primaryKey: string
  searchBy: string
  columnNames: Array<string>
  RowComponent: React.FunctionComponent<RowFragmentProps>
  FormComponent: React.FunctionComponent<FormFragmentProps>
  FilterComponent: React.FunctionComponent<FilterFragmentProps>
}
