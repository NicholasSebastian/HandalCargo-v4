/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { memo, useContext, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faThLarge, faCopy, faUser, faCog } from '@fortawesome/free-solid-svg-icons'

import { Settings } from './Context'
import { TabControl } from './Layout'
import elements from './Sidebar.json'

const icons = [faBoxOpen, faThLarge, faCopy, faUser, faCog]

const Sidebar = (): JSX.Element => {
  const { localize } = useContext(Settings)!
  const updateTab = useContext(TabControl)!

  const [selected, setSelected] = useState<number | null>(null)

  return (
    <StyledSidebar>
      {elements.map(({ buttonName, subButtonNames }, index) =>
        <Fragment key={index}>
          <Button selected={selected === index}
            onClick={() => setSelected(selected === index ? null : index)}>
            <FontAwesomeIcon icon={icons[index]} size="lg" fixedWidth />
            {localize(buttonName)}
          </Button>
          <SubButtonGroup selected={selected === index}>
            {subButtonNames.map((subButtonName, subIndex) =>
              <Link key={subIndex} to={'/' + subButtonName}
                onClick={() => updateTab(subButtonName)}>
                {localize(subButtonName)}
              </Link>
            )}
          </SubButtonGroup>
        </Fragment>
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
  position: relative;

  > svg {
    margin-right: 15px;
  }

  &:hover {
    cursor: pointer;
    ${({ selected, theme }) => !selected && { color: theme.fgStrong }};
  }

  &::after {
    content: '˅'; // change this, it looks ugly.
    position: absolute;
    right: 20px;
    font-weight: 900;
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

interface ButtonProps {
  selected: boolean
}
