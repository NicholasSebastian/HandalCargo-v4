/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useContext, useEffect, createContext, memo } from 'react'
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { remote } from 'electron'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { Settings } from './Context'
import toDashCase from '../utils/ToDashCase'

import Header from './Header'
import Sidebar from './Sidebar'

import Welcome from '../pages/Welcome'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Staff from '../pages/Staff'

const HEADER_HEIGHT = 50
const SIDEBAR_WIDTH = 250
const TABSPACE_HEIGHT = 40
const TAB_WIDTH = 200
const TITLE_HEIGHT = 50

export const TabControl = createContext<Function | null>(null)

const Layout = (): JSX.Element => {
  const { localize } = useContext(Settings)!
  
  const [tabs, setTabs] = useState<Array<string>>([])
  const [view, setView] = useState<string | null>(null)

  const [maxTabs, setMaxTabs] = useState<number>(4)
  useEffect(() => {
    window.addEventListener('resize', () => {
      const currentWidth = remote.getCurrentWindow().getBounds().width
      const tabSpaceWidth = currentWidth - SIDEBAR_WIDTH - 50 // offset
      setMaxTabs(Math.floor(tabSpaceWidth / TAB_WIDTH))
    })
  }, [])
  useEffect(() => {
    if (tabs.length > maxTabs) setTabs(tabs.slice(1))
  }, [maxTabs])

  function updateTabs (linkPressed: string) {
    if (!tabs.includes(linkPressed)) {
      if (tabs.length >= maxTabs) setTabs([...tabs.slice(1), linkPressed])
      else setTabs([...tabs, linkPressed])
    }
    setView(linkPressed)
  }

  const TabSpace = (): JSX.Element => {
    return (
      <StyledTabSpace>
        {tabs.map(tab =>
          <Tab key={tab} selected={tab === view}
            to={'/' + toDashCase(tab)} onClick={() => setView(tab)}>
            {localize(tab)}
            <FontAwesomeIcon icon={faTimes}
              onClick={e => {
                e.stopPropagation()
                setTabs(tabs.filter(tab0 => tab0 !== tab))
                // if (tab === view) {
                //   setView(null)
                //   change the page back to welcome / dashboard
                // }
              }} />
          </Tab>
        )}
        <TabTip>{tabs.length}/{maxTabs}</TabTip>
      </StyledTabSpace>
    )
  }

  return (
    <Router>
      <StyledLayout>
        <Title>Handal Cargo</Title>
        <TabControl.Provider value={updateTabs}>
          <Header />
          <Sidebar />
        </TabControl.Provider>
        <Body>
          <TabSpace />
          <TitleSpace>{localize(view)}</TitleSpace>
          <Content>
            <Switch>
              <Route path="/" exact component={ Welcome } />
              <Route path="/dashboard" component={ Dashboard } />
              <Route path="/staff" component={ Staff } />
              <Route path="/profile" component={ Profile } />
            </Switch>
          </Content>
        </Body>
      </StyledLayout>
    </Router>
  )
}

export default memo(Layout)

const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: ${SIDEBAR_WIDTH}px 1fr;
  grid-template-rows: ${HEADER_HEIGHT}px 1fr;
  height: 100%;
`

const Title = styled.h1`
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.bg};
  margin: 0;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Body = styled.section`
  border-top: 1px solid ${({ theme }) => theme.fgWeak};
  border-left: 1px solid ${({ theme }) => theme.fgWeak};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: ${TABSPACE_HEIGHT}px ${TITLE_HEIGHT}px 1fr;
`

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

const TitleSpace = styled.div`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.fgStrong};
  border-top: 1px solid ${({ theme }) => theme.fgWeak};
  border-bottom: 1px solid ${({ theme }) => theme.fgWeak};
  padding-left: 20px;
  display: flex;
  align-items: center;
  font-size: 18px;
`

const Content = styled.section`
  background-color: ${({ theme }) => theme.bgDilute};
  overflow: hidden;
`

interface TabProps {
  selected: boolean
}
