import React from 'react'

import Template from '../../components/ComplexTemplate'

import Row from './Row'
import Filter from './Filter'
import Form from './Form'

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
        SELECT `profilepic`, `staffid`, `staffname`, `level`, `groupcode`, \
          `address1`, `district`, `city`, `phonenum`, `gender`, `placeofbirth`, `dateofbirth`, \
          `ot/hr`, `salary`, `foodallowance`, `bonus`, `dilligencebonus`, `status`, `dateofemployment` \
        FROM `staff` \
        WHERE `staffid` = ?'
      }
      insertQuery={'\
        INSERT INTO `staff` \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      } // TODO: write the update query
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
