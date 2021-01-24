/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { Fragment } from 'react'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { RowFragmentProps } from '../../components/ComplexTable'

const Row = ({ row, PutThisInLastTd }: RowFragmentProps): JSX.Element => {
  return (
    <Fragment>
      <td>{row.customerid}</td>
      <td>{row.customername}</td>
      <td>{row.email}</td>
      <td>{
        row.status
          ? <><GreenIcon icon={faCheckCircle} /> Active</>
          : <><RedIcon icon={faTimesCircle} /> Inactive</>
      }
      <PutThisInLastTd />
      </td>
    </Fragment>
  )
}

export default Row

const GreenIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.green};
`

const RedIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.red};
`
