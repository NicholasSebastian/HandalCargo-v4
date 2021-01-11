/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, useRef } from 'react'
import { ipcRenderer, remote } from 'electron'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

const { dialog } = remote

const HEADPANEL_HEIGHT = 30
const SIDEPANEL_WIDTH = 200

const Table = ({
  tableName, columnNames, RowFragment, primaryKey, searchBy,
  tableQuery, deleteQuery, toAddPage, toViewPage, toEditPage
}: TableProps): JSX.Element => {

  // NOTE: I feel that this component can still be written in a better way than this.

  const [data, setData] = useState<Array<never>>()
  const [filter, setFilter] = useState('')

  useEffect(() => {
    ipcRenderer.once(`${tableName}TableQuery`, (event, data) => {
      setData(data)
      console.log('refreshed') // REMOVE THIS; for debugging purposes only.
    })
    refreshTable()
  }, [])

  function refreshTable () {
    ipcRenderer.send('query', tableQuery, [], `${tableName}TableQuery`)
  }

  function handleDelete (primaryKey: string) {
    dialog.showMessageBox({
      title: 'Delete record',
      message: 'Are you sure you want to delete this record?',
      buttons: ['Delete', 'Cancel']
    })
      .then(({ response }) => {
        if (response === 0) {
          ipcRenderer.send('query', deleteQuery, [primaryKey])
          refreshTable()
        }
      })
  }

  return (
    <StyledArea>
      <StyledHeader>
        <span>Total <span>{data?.length}</span></span>
        <button onClick={toAddPage}>Add Record</button>
      </StyledHeader>
      <StyledTable>
        <table>
          <thead>
            <tr>
              {columnNames.map((colName, i) => <th key={i}>{colName}</th>)}
            </tr>
          </thead>
          <tbody>
            {data?.filter(row => new RegExp('^' + filter).test(row[searchBy]))
              .map(row =>
                <tr key={row} onClick={() => toViewPage(row[primaryKey])}>
                  <RowFragment row={row} />
                  <button>
                    <FontAwesomeIcon icon={faEllipsisH} />
                    <div>
                      <button onClick={() => toEditPage(row[primaryKey])}>Edit</button>
                      <button onClick={() => handleDelete(row[primaryKey])}>Delete</button>
                    </div>
                  </button>
                </tr>
            )}
          </tbody>
        </table>
      </StyledTable>
      <StyledPanel>
        <div>
          <input type="text" placeholder="Search" onChange={e => setFilter(e.target.value)} />
        </div>
        <div>Filter</div>
      </StyledPanel>
    </StyledArea>
  )
}

const Form = ({ FormFragment, returnFunction, initialData, queryOnClick }: FormProps) => {
  const [formData, setFormData] = useState<Array<string>>(initialData || [])

  function handleSave () {
    queryOnClick!(formData)
    returnFunction()
  }

  return (
    <StyledFormArea editable={queryOnClick !== undefined}>
      <div>
        <FormFragment // All form elements should reflect the formData state.
          formData={formData}
          setFormData={setFormData} />
        {queryOnClick && <button onClick={handleSave}>Save</button>}
        <button onClick={returnFunction}>Cancel</button>
      </div>
    </StyledFormArea>
  )
}

const Template = ({
  tableName, columnNames,
  tableQuery, formQuery, insertQuery, updateQuery, deleteQuery,
  RowComponent, FormComponent, primaryKey, searchBy
}: TemplateProps): JSX.Element => {

  const [mode, setMode] = useState<Mode>('Table')
  const selected = useRef<string | null>(null)

  // TODO: fix error when fetching initialData. query returns empty array for some reason.
  // TODO: move selected ref into Form component and have it passed as a parameter back on the queryOnClick callback.

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
            initialData={Object.values(ipcRenderer.sendSync('querySync', formQuery, [selected])[0])} />
        )
      case 'Edit':
        return (
          <Form
            FormFragment={FormComponent}
            returnFunction={() => setMode('Table')}
            initialData={Object.values(ipcRenderer.sendSync('querySync', formQuery, [selected])[0])}
            queryOnClick={formData => {
              dialog.showMessageBox({
                title: 'Update Record',
                message: 'Are you sure you want to modify this record?',
                buttons: ['Modify', 'Cancel']
              })
                .then(({ response }) => {
                  if (response === 0) {
                    ipcRenderer.send('query', updateQuery, [...formData, selected])
                  }
                })
            }} />
        )
      default:
        return (
          <Table
            tableName={tableName}
            columnNames={columnNames}
            tableQuery={tableQuery}
            RowFragment={RowComponent}
            primaryKey={primaryKey}
            searchBy={searchBy}
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

const StyledArea = styled.div`
  height: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr ${SIDEPANEL_WIDTH}px;
  grid-template-rows: ${HEADPANEL_HEIGHT}px 1fr;
  column-gap: 20px;
  row-gap: 10px;
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  > span {
    color: ${({ theme }) => theme.fgMid};
    font-size: 13px;

    > span { 
      color: ${({ theme }) => theme.fgStrong};
      font-size: 17px; 
      margin-left: 5px;
    }
  }

  > button {
    background: none;
    color: ${({ theme }) => theme.accent};
    height: 100%;
    padding: 0 15px;
    margin-left: 5px;
    border: 1px solid ${({ theme }) => theme.accent};
    border-radius: 5px;
    transition: all 0.2s;

    &:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.bg};
    }
  }
`

const StyledTable = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;

  background-color: ${({ theme }) => theme.bg};
  border-radius: 5px;
  padding: 15px;
  box-shadow: 0 0 5px ${({ theme }) => theme.fgWeak};

  > table {
    width: 100%;
    border-collapse: collapse;

    * { 
      text-align: left;
      font-size: 14px;
    }

    th { color: ${({ theme }) => theme.fgStrong}; }

    td { color: ${({ theme }) => theme.fgMid}; }

    th, td { 
      border-bottom: 1px solid ${({ theme }) => theme.fgWeak}; 
      padding: 10px 0;
    }

    tbody > tr {
      transform: scale(1); // hack

      &:hover {
        cursor: pointer;
      }

      > td:last-of-type {
        position: relative;
      }
      
      > button:last-child {
        background: none;
        border: none;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;

        &:hover > div {
          display: block;
        }

        > div {
          background-color: ${({ theme }) => theme.bg};
          border: 1px solid ${({ theme }) => theme.fgWeak};
          width: 80px;
          padding: 5px;
          border-radius: 2px;
          display: none;
          position: absolute;
          top: 30px;
          right: 0;

          > button {
            background: none;
            width: 100%;
            border: none;
            border-radius: 2px;
            padding: 5px;
            font-size: 13px;

            &:hover {
              cursor: pointer;
              background-color: ${({ theme }) => theme.fgWeak};
            }
          }
        }
      }
    }
  }
`

const StyledPanel = styled.div`
  grid-row: 2 / 3;

  > div {
    background-color: ${({ theme }) => theme.bg};
    border-radius: 5px;
    padding: 15px;
    box-shadow: 0 0 5px ${({ theme }) => theme.fgWeak};
    margin-bottom: 10px;

    &:first-child {
      padding: 8px 15px;
      > input { 
        background: none;
        border: none; 
      }
    }
  }
`

const StyledFormArea = styled.div<{ editable: boolean }>`
  height: 100%;
  padding: 20px;

  > div {
    background-color: ${({ theme }) => theme.bg};
    border-radius: 5px;
    padding: 15px;
    box-shadow: 0 0 5px ${({ theme }) => theme.fgWeak};

    input { 
      pointer-events: ${({ editable }) => editable ? 'auto' : 'none'}; 
    }
  }
`

type Mode = 'Table' | 'Add' | 'View' | 'Edit'

interface TemplateProps {
  tableName: string
  columnNames: Array<string>
  tableQuery: string
  formQuery: string
  insertQuery: string
  updateQuery: string
  deleteQuery: string
  RowComponent: React.FunctionComponent<{row: never}>
  FormComponent: React.FunctionComponent<FormFragmentProps>
  searchBy: string
  primaryKey: string
}

interface TableProps {
  tableName: string,
  columnNames: Array<string>
  tableQuery: string
  RowFragment: React.FunctionComponent<{ row: never }>
  primaryKey: string
  searchBy: string
  deleteQuery: string
  toAddPage: () => void
  toViewPage: (selected: string) => void
  toEditPage: (selected: string) => void
}

interface FormProps {
  FormFragment: React.FunctionComponent<FormFragmentProps>
  returnFunction: () => void
  initialData?: Array<string>
  queryOnClick?: (formData: Array<string>) => void
}

export interface FormFragmentProps {
  formData: Array<string>
  setFormData: React.Dispatch<React.SetStateAction<string[]>>
}
