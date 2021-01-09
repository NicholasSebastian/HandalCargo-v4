/* eslint-disable no-multi-str */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import Template from '../components/ComplexTemplate'

const columnNames = ['Staff ID', 'Full Name', 'Job', 'Phone Number', 'Status']
const query = '\
  SELECT `staffid`, `staffname`, `groupname`, `phonenum`, `status` \
  FROM `staff` \
  LEFT JOIN `staffgroup` \
  ON `staff`.`groupcode` = `staffgroup`.`stfgrcode`'

const Row = ({ row }: RowProps): JSX.Element => {
  return (
    <React.Fragment>
      <td>{row.staffid}</td>
      <td>{row.staffname}</td>
      <td>{row.groupname}</td>
      <td>{row.phonenum}</td>
      <td>{
        row.status
          ? <><GreenIcon icon={faCheckCircle} /> Active</>
          : <><RedIcon icon={faTimesCircle} /> Inactive</>
      }</td>
    </React.Fragment>
  )
}

const Staff = (): JSX.Element => {
  return (
    <Template
      columnNames={columnNames}
      query={query}
      RowComponent={Row}
      searchBy='staffname' />
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
