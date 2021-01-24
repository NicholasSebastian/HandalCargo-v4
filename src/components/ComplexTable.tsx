/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-extra-parens */
/* eslint-disable padded-blocks */

import React, { useState, useEffect, Fragment } from 'react'
import { ipcRenderer, remote } from 'electron'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

const { dialog } = remote

const HEADPANEL_HEIGHT = 30
const SIDEPANEL_WIDTH = 200

const Table = (props: TableProps): JSX.Element => {
  const { RowFragment, FilterFragment } = props

  const [data, setData] = useState<Array<never>>()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<(data: Array<never>) => Array<never>>(() => (data: Array<never>) => data)

  useEffect(refreshTable, [props.view])

  function refreshTable () {
    ipcRenderer.once(props.id, (event, data) => setData(data))
    ipcRenderer.send('query', props.tableQuery, [], props.id)
  }

  function handleDelete (primaryKey: string) {
    dialog.showMessageBox({
      title: 'Delete record',
      message: 'Are you sure you want to delete this record?',
      buttons: ['Delete', 'Cancel']
    })
      .then(({ response }) => {
        if (response === 0) {
          ipcRenderer.send('queryNoReply', props.deleteQuery, [primaryKey])
          refreshTable()
        }
      })
  }

  return (
    <StyledArea>
      <StyledHeader>
        <span>Total <span>{data?.length}</span></span>
        <button onClick={props.toAddPage}>Add Record</button>
      </StyledHeader>
      <StyledTable>
        <table>
          <thead>
            <tr>
              {props.columnNames.map((colName, i) => <th key={i}>{colName}</th>)}
            </tr>
          </thead>
          <tbody>
            {data && filter(data)
              .filter(row => new RegExp('^' + search, 'i').test(row[props.searchBy]))
              .map((row, i) =>
                <Fragment key={row[props.primaryKey]}>
                  <StyledRow zIndex={data.length - i}
                    onClick={() => props.toViewPage(row[props.primaryKey])}>
                    <RowFragment row={row} PutThisInLastTd={() =>
                      <HoverPanel>
                        <FontAwesomeIcon icon={faEllipsisH} />
                        <div>
                          <button onClick={e => {
                            e.stopPropagation()
                            props.toEditPage(row[props.primaryKey])
                          }}>Edit</button>
                          <button onClick={e => {
                            e.stopPropagation()
                            handleDelete(row[props.primaryKey])
                          }}>Delete</button>
                        </div>
                      </HoverPanel>
                    } />
                  </StyledRow>
                </Fragment>
              )}
          </tbody>
        </table>
      </StyledTable>
      <StyledPanel>
        <div>
          <input type="text" placeholder="Search" onChange={e => setSearch(e.target.value)} />
        </div>
        <div>
          <h2>Filters</h2>
          <FilterFragment setFilter={setFilter} />
        </div>
      </StyledPanel>
    </StyledArea>
  )
}

export default Table

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
  }
`

const StyledRow = styled.tr<{ zIndex: number }>`
  &:hover {
    cursor: pointer;
  }

  > td:last-child {
    position: relative;
    z-index: ${({ zIndex }) => zIndex};
  }
`

const HoverPanel = styled.div`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;

  &:hover {
    cursor: pointer;
  }

  &:hover > div {
    display: block !important;
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

    &:hover {
      display: block;
    }
  }
`

const StyledPanel = styled.div`
  grid-row: 2 / 3;

  > div {
    background-color: ${({ theme }) => theme.bg};
    border-radius: 5px;
    box-shadow: 0 0 5px ${({ theme }) => theme.fgWeak};
    margin-bottom: 10px;

    &:first-child {
      padding: 8px 15px;
      > input { 
        background: none;
        border: none; 
      }
    }

    &:last-child {
      padding: 15px;

      > h2 {
        color: ${({ theme }) => theme.fgStrong};
        margin: 0;
        font-size: 16px;
      }

      > h3 {
        color: ${({ theme }) => theme.fgMid};
        font-size: 14px;
      }

      > div {
        color: ${({ theme }) => theme.fgMid};
        display: flex;
        align-items: center;
        padding: 2px 0;
        font-size: 13px;

        > input[type="checkbox"] {
          margin: 0; 
          margin-right: 5px;
        }
      }
    }
  }
`

interface TableProps {
  id: string
  view: string
  primaryKey: string
  tableQuery: string
  deleteQuery: string
  toAddPage: () => void
  toViewPage: (selected: string) => void
  toEditPage: (selected: string) => void
  columnNames: Array<string>
  RowFragment: React.FunctionComponent<RowFragmentProps>
  searchBy: string
  FilterFragment: React.FunctionComponent<FilterFragmentProps>
}

export interface RowFragmentProps {
  row: any
  PutThisInLastTd: any
}

export interface FilterFragmentProps {
  setFilter: React.Dispatch<React.SetStateAction<(data: Array<never>) => Array<never>>>
}
