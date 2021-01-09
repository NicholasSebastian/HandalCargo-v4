/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

const HEADPANEL_HEIGHT = 30
const SIDEPANEL_WIDTH = 200

const Template = ({ columnNames, query, RowComponent, searchBy }: TemplateProps): JSX.Element => {
  const [data, setData] = useState<Array<any>>()
  const [filter, setFilter] = useState('')
  useEffect(() => {
    ipcRenderer.send('query', query, [], 'staffQuery')
    ipcRenderer.on('staffQuery', (event, data) => { setData(data) })
  }, [])

  return (
    <StyledArea>
      <StyledHeader>
        <span>Total <span>{data?.length}</span></span>
        <button>Add Staff</button>
      </StyledHeader>
      <StyledTable>
        <table>
          <thead>
            <tr>
              {columnNames.map((colName, i) =>
                <th key={i}>{colName}</th>)}
            </tr>
          </thead>
          <tbody>
            {data
              ?.filter(row => new RegExp('^' + filter).test(row[searchBy]))
              .map(row =>
                <tr key={row}>
                  <RowComponent row={row} />
                  <button>
                    <FontAwesomeIcon icon={faEllipsisH} />
                    <div>
                      <button>View</button>
                      <button>Delete</button>
                    </div>
                  </button>
                </tr>
            )}
          </tbody>
        </table>
      </StyledTable>
      <StyledPanel>
        <div>
          <input type="text" placeholder="Search"
            onChange={e => setFilter(e.target.value)} />
        </div>
        <div>Filter</div>
      </StyledPanel>
    </StyledArea>
  )
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

interface TemplateProps {
  columnNames: Array<string>
  query: string
  RowComponent: React.FunctionComponent<{row: any}>
  searchBy: string
}
