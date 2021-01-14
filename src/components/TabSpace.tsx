/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { remote } from 'electron'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { Settings } from './Context'

import { SIDEBAR_WIDTH } from './Layout'
const TAB_WIDTH = 200

const TabSpace = ({ view, setView, tabs, setTabs, maxTabs, setMaxTabs }: TabSpaceProps): JSX.Element => {
  const history = useHistory() // maybe use Hash History instead??
  const { localize } = useContext(Settings)!

  useEffect(() => {
    window.addEventListener('resize', () => {
      const currentWidth = remote.getCurrentWindow().getBounds().width
      const tabSpaceWidth = currentWidth - SIDEBAR_WIDTH - 50
      setMaxTabs(Math.floor(tabSpaceWidth / TAB_WIDTH))
    })
  }, [])

  useEffect(() => {
    if (tabs.length > maxTabs) setTabs(tabs.slice(tabs.length - maxTabs))
  }, [maxTabs])

  return (
    <StyledTabSpace>
      {tabs.map(tab =>
        <Tab key={tab} selected={tab === view} to={'/' + tab} onClick={() => setView(tab)}>
          {localize(tab)}
          <FontAwesomeIcon icon={faTimes}
            onClick={e => {
              e.stopPropagation()
              setTabs(tabs.filter(tab0 => tab0 !== tab))
              if (tab === view) {
                setView(null)
                history.push('/') // BUG: only routes to the page for a second then immediately blinks back into the previous page.
              }
            }} />
        </Tab>
      )}
      <TabTip>{tabs.length}/{maxTabs}</TabTip>
    </StyledTabSpace>
  )
}

export default TabSpace

const StyledTabSpace = styled.div`
  background: none;
  display: flex;
  align-items: flex-end;
  padding-left: 20px;
  overflow-x: hidden;
  position: relative;
`

const TabTip = styled.div`
  color: ${({ theme }) => theme.fgWeak};
  font-size: 14px;
  position: absolute;
  right: 10px;
  bottom: 2px;
`

const Tab = styled(Link)<TabProps>`
  background-color: ${({ theme, selected }) => selected ? theme.bg : theme.bgDilute};
  color: ${({ theme, selected }) => selected ? theme.fgStrong : theme.fgMid};
  width: ${TAB_WIDTH}px;
  padding: ${({ selected }) => selected ? 8 : 6}px 10px;
  font-size: 11px;
  text-decoration: none;
  position: relative;

  border-top: 1px solid ${({ theme }) => theme.fgWeak};
  border-left: 1px solid ${({ theme }) => theme.fgWeak};
  border-right: 1px solid ${({ theme }) => theme.fgWeak};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  > svg {
    position: absolute;
    top: ${({ selected }) => selected ? 10 : 8}px;
    right: 10px;

    &:hover {
      color: ${({ theme }) => theme.accent};
      transform: scale(1.25);
    }
  }
`

interface TabSpaceProps {
  view: string | null
  setView: React.Dispatch<React.SetStateAction<string | null>>
  tabs: Array<string>
  setTabs: React.Dispatch<React.SetStateAction<Array<string>>>
  maxTabs: number
  setMaxTabs: React.Dispatch<React.SetStateAction<number>>
}

interface TabProps {
  selected: boolean
}
