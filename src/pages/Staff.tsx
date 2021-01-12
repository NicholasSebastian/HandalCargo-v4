/* eslint-disable no-multi-str */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { Fragment, useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import Template from '../components/ComplexTemplate'
import { FilterFragmentProps } from '../components/ComplexTable'
import { FormFragmentProps } from '../components/Form'

const Row = ({ row }: RowProps): JSX.Element => {
  return (
    <Fragment>
      <td>{row.staffid}</td>
      <td>{row.staffname}</td>
      <td>{row.groupname}</td>
      <td>{row.phonenum}</td>
      <td>{
        row.status
          ? <><GreenIcon icon={faCheckCircle} /> Active</>
          : <><RedIcon icon={faTimesCircle} /> Inactive</>
      }</td>
    </Fragment>
  )
}

// TODO: this hot mess

const Filter = ({ setFilter }: FilterFragmentProps): JSX.Element => {
  useEffect(() => setFilter(() =>
    (data: Array<never>) => {
      return data
    }
  ), [])

  return (
    <Fragment>
    </Fragment>
  )
}

const Form = ({ formData, setFormData }: FormFragmentProps): JSX.Element => {
  const [staffGroup, setStaffGroup] = useState<Array<StaffGroup> | null>(null)
  useEffect(() => {
    ipcRenderer.once('staffFormQuery', (event, data) => { setStaffGroup(data) })
    ipcRenderer.send('query', 'SELECT `stfgrcode`, `groupname` FROM `staffgroup`', [], 'staffFormQuery')
  }, [])

  return (
    <Fragment>
    </Fragment>
  )
}

const Staff = (): JSX.Element => {
  return (
    <Template
      id='staff'
      primaryKey='staffid'
      searchBy='staffname'
      columnNames={['Staff ID', 'Full Name', 'Job', 'Phone Number', 'Status']}
      tableQuery={'\
        SELECT `staffid`, `staffname`, `groupname`, `phonenum`, `status` \
        FROM `staff` \
        LEFT JOIN `staffgroup` \
        ON `staff`.`groupcode` = `staffgroup`.`stfgrcode`'
      }
      formQuery={'\
        SELECT `profilepic`, `staffid`, `staffname`, `pwd`, `level`, `groupcode`, \
          `address1`, `district`, `city`, `phonenum`, `gender`, `placeofbirth`, `dateofbirth`, \
          `ot/hr`, `salary`, `foodallowance`, `bonus`, `dilligencebonus`, `status`, `dateofemployment` \
        FROM `staff` \
        WHERE `staffid` = ?'
      }
      insertQuery={'\
        INSERT INTO `staff` \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      }
      updateQuery={'\
        UPDATE `staff` \
        SET `staffid` = ?, `staffname` = ?. `groupcode` = ? \
        WHERE `staffid` = ?'
      }
      deleteQuery={'\
        DELETE FROM `staff` \
        WHERE `staffid` = ?'
      }
      RowComponent={Row}
      FormComponent={Form}
      FilterComponent={Filter} />
  )
}

export default Staff

const GreenIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.green};
`

const RedIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.red};
`

interface RowProps {
  row: any
}

interface StaffGroup {
  stfgrcode: string,
  groupname: string
}
