/* eslint-disable brace-style */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { memo, useContext, useState, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { remote } from 'electron'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faThLarge, faCopy, faUser, faCog } from '@fortawesome/free-solid-svg-icons'

import { Settings } from './Context'
import { TabControl } from './Layout'
import elements from './Sidebar.json'

const prompt = remote.require('electron-prompt')
const { dialog } = remote

const icons = [faBoxOpen, faThLarge, faCopy, faUser, faCog]

const Sidebar = (): JSX.Element => {
  const { localize } = useContext(Settings)!
  const updateTab = useContext(TabControl)!

  const accessLevel = useRef<number>(JSON.parse(window.sessionStorage.getItem('Profile')!).level)
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect (index: number) {
    if (selected === index) {
      setSelected(null)
      return
    }
    if (accessLevel.current === 3) {
      setSelected(index)
      return
    }

    const requireMasterAccess = accessLevel.current === 2 && index > 2
    const requireManagerAccess = accessLevel.current === 1 && index > 1
    if (requireMasterAccess || requireManagerAccess) {
      prompt({
        title: 'Access Denied',
        label: 'Please enter the password:',
        type: 'input',
        alwaysOnTop: true
      })
        .then((result: string | null) => {
          if (result === null) return
          if (result === 'test') setSelected(index)
          else dialog.showErrorBox('Access Denied', 'You entered the wrong password.')
        })
    }
    else setSelected(selected === index ? null : index)
  }

  return (
    <StyledSidebar>
      {elements.map(({ buttonName, subButtonNames }, index) =>
        <Fragment key={index}>
          <Button selected={selected === index}
            onClick={() => handleSelect(index)}>
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
  }
`

const SubButtonGroup = styled.div<ButtonProps>`
  padding-left: 60px;
  display: ${({ selected }) => selected ? 'block' : 'none'};

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
