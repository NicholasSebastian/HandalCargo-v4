/* eslint-disable padded-blocks */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, Fragment } from 'react'
import { ipcRenderer } from 'electron'

import { FilterFragmentProps } from '../../components/ComplexTable'

const Filter = ({ setFilter }: FilterFragmentProps): JSX.Element => {

  // Prepare data for the filter UI.
  const [staffGroup, setStaffGroup] = useState<Array<string>>([])
  useEffect(() => {
    ipcRenderer.once('staffFilterQuery', (event, data) => {
      setStaffGroup(data.map((d: any) => d.groupname))
      setJobFilter(Array(data.length).fill(false))
    })
    ipcRenderer.send('query', 'SELECT `groupname` FROM `staffgroup`', [], 'staffFilterQuery')
  }, [])

  // Setting the filter according to UI.
  const [jobFilter, setJobFilter] = useState<Array<boolean>>([])
  const [activeFilter, setActiveFilter] = useState<[boolean, boolean]>([false, false])
  useEffect(configureFilter, [jobFilter, activeFilter])

  function configureFilter () {
    setFilter(() =>
      (data: Array<never>) => {
        return data
          .filter(row => {
            if (jobFilter.every(filter => filter === false)) return true

            let ok = false
            staffGroup.forEach((stfgr, i) => {
              if (jobFilter[i] && (row as any).groupname === stfgr) ok = true
            })
            return ok
          })
          .filter(row => {
            if (activeFilter.every(filter => filter === false)) return true

            let ok = false
            if (activeFilter[0] && (row as any).status == true) ok = true
            if (activeFilter[1] && (row as any).status == false) ok = true
            return ok
          })
      }
    )
  }

  // Filter panel UI.
  return (
    <Fragment>
      <h3>Job</h3>
      {jobFilter.map((filter, i) =>
        <div key={i}>
          <input type="checkbox" checked={filter} onChange={e =>
            setJobFilter(prevState => [...prevState.slice(0, i), e.target.checked, ...prevState.slice(i + 1)])} />
          {staffGroup[i]}
        </div>
      )}
      <h3>Status</h3>
      <div>
        <input type="checkbox" checked={activeFilter[0]} onChange={e =>
          setActiveFilter(prevState => [e.target.checked, prevState[1]])} />
        Active
      </div>
      <div>
        <input type="checkbox" checked={activeFilter[1]} onChange={e =>
          setActiveFilter(prevState => [prevState[0], e.target.checked])} />
        Inactive
      </div>
    </Fragment>
  )
}

export default Filter
