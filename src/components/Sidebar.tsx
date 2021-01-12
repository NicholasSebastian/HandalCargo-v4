/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { memo, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faThLarge, faCopy, faUser, faCog, IconDefinition } from '@fortawesome/free-solid-svg-icons'

import { Settings } from './Context'
import { TabControl } from './Layout'
import toDashCase from '../utils/ToDashCase'

const elements: Array<SidebarElement> = [
  {
    buttonIcon: faBoxOpen,
    buttonName: 'shipping',
    subButtonNames: [
      'seaFreight', 'airCargo', 'invoiceEntry', 'payment', 'customers'
    ]
  },
  {
    buttonIcon: faThLarge,
    buttonName: 'references',
    subButtonNames: [
      'containerGroups', 'carriers', 'routes', 'handlers', 'planes', 'currencies', 'productDetails', 'expeditions'
    ]
  },
  {
    buttonIcon: faCopy,
    buttonName: 'reports',
    subButtonNames: [
      'dashboard', 'payroll'
    ]
  },
  {
    buttonIcon: faUser,
    buttonName: 'master',
    subButtonNames: [
      'staff', 'staffGroups', 'accessLevels', 'companySetup'
    ]
  },
  {
    buttonIcon: faCog,
    buttonName: 'settings',
    subButtonNames: [
      'databaseSetup', 'backupRestore'
    ]
  }
]

const Sidebar = (): JSX.Element => {
  const { localize } = useContext(Settings)!
  const updateTab = useContext(TabControl)!
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <StyledSidebar>
      {elements.map(({ buttonIcon, buttonName, subButtonNames }, index) =>
        <React.Fragment key={index}>
          <Button selected={selected === index}
            onClick={() => setSelected(selected === index ? null : index)}>
            <FontAwesomeIcon icon={buttonIcon} size="lg" fixedWidth />
            {localize(buttonName)}
          </Button>
          <SubButtonGroup selected={selected === index}>
            {subButtonNames.map((subButtonName, subIndex) =>
              <Link key={subIndex} to={'/' + toDashCase(subButtonName)}
                onClick={() => updateTab(subButtonName)}>
                {localize(subButtonName)}
              </Link>
            )}
          </SubButtonGroup>
        </React.Fragment>
      )}
    </StyledSidebar>
  )
}

export default memo(Sidebar)

const StyledSidebar = styled.div`
  background-color: ${({ theme }) => theme.bg};
  padding-top: 10px;
`

const Button = styled.button<ButtonProps>`
  background: none;
  color: ${({ selected, theme }) => selected ? theme.accent : theme.fgMid};
  display: block; 
  width: 100%;
  border: none;
  padding: 9px 0 9px 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  text-align: left;

  > svg {
    margin-right: 15px;
  }

  &:hover {
    cursor: pointer;
    ${({ selected, theme }) => !selected && { color: theme.fgStrong }};
  }
`

const SubButtonGroup = styled.div<ButtonProps>`
  display: ${({ selected }) => selected ? 'block' : 'none'};
  padding-left: 60px;

  > a {
    color: ${({ theme }) => theme.fgMid};
    font-size: 14px;
    text-decoration: none;
    display: block;
    padding-bottom: 8px;

    &:hover {
      color: ${({ theme }) => theme.fgStrong};
    }
  }
`

interface SidebarElement {
  buttonIcon: IconDefinition,
  buttonName: string,
  subButtonNames: Array<string>
}

interface ButtonProps {
  selected: boolean
}
