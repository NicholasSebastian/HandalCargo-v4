/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */

import React, { useState, useContext, useRef, createContext, memo, lazy, Suspense } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import { Settings } from './Context'

import Header from './Header'
import Sidebar from './Sidebar'
import TabSpace from './TabSpace'
import Loading from './Loading'

const Welcome = lazy(() => import('../pages/Welcome'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Profile = lazy(() => import('../pages/Profile'))
const Staff = lazy(() => import('../pages/Staff/Index'))

const HEADER_HEIGHT = 50
export const SIDEBAR_WIDTH = 250
const TABSPACE_HEIGHT = 40
const TITLE_HEIGHT = 50

export const TabControl = createContext<Function | null>(null)
export const ScrollControl = createContext<Function | null>(null)

// Pseudo HOC for determining welcome screen according to account access level.
const WelcomeOrDashboard = (): JSX.Element => {
  const { level } = JSON.parse(window.sessionStorage.getItem('Profile')!)
  return level < 2 ? <Welcome /> : <Dashboard />
}

const Layout = (): JSX.Element => {
  const { localize } = useContext(Settings)!
  const contentElement = useRef<HTMLElement>(null)

  // Lifting state up from TabSpace component
  const [view, setView] = useState<string | null>(null)
  const [tabs, setTabs] = useState<Array<string>>([])
  const [maxTabs, setMaxTabs] = useState<number>(4)

  function updateTabs (linkPressed: string) {
    if (!tabs.includes(linkPressed)) {
      if (tabs.length >= maxTabs) setTabs([...tabs.slice(1), linkPressed])
      else setTabs([...tabs, linkPressed])
    }
    setView(linkPressed)
  }

  function scrollToTop () {
    contentElement.current!.scrollTop = 0
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
          <TabSpace
            view={view}
            setView={setView}
            tabs={tabs}
            setTabs={setTabs}
            maxTabs={maxTabs}
            setMaxTabs={setMaxTabs} />
          <TitleSpace>{localize(view)}</TitleSpace>
          <Content ref={contentElement}>
            <ScrollControl.Provider value={scrollToTop} >
              <Suspense fallback={<Loading />}>
                <Switch>
                  <Route path="/" exact component={ WelcomeOrDashboard } />
                  <Route path="/dashboard" component={ Dashboard } />
                  <Route path="/profile" component={ Profile } />
                  <Route path="/staff" component={ Staff } />
                </Switch>
              </Suspense>
            </ScrollControl.Provider>
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
  overflow: hidden;
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
  overflow: hidden;
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
  overflow-y: scroll;
  scroll-behavior: smooth;
`
