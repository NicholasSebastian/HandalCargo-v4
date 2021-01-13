import React, { useEffect, Fragment } from 'react'
import { FilterFragmentProps } from '../../components/ComplexTable'

const Filter = ({ setFilter }: FilterFragmentProps): JSX.Element => {
  useEffect(filter, [])

  // Setting the filter based on user input.
  function filter () {
    setFilter(() =>
      (data: Array<never>) => {
        return data
      }
    )
  }

  // Filter panel UI.
  return (
    <Fragment>
    </Fragment>
  )
}

export default Filter
