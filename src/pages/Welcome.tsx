/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Settings } from '../components/Context'

// TODO: If access level greater than 1, redirect to dashboard

const Welcome = (): JSX.Element => {
  const { localize } = useContext(Settings)!

  const { staffname } = JSON.parse(window.sessionStorage.getItem('Profile')!)

  const now = useRef(new Date())
  useEffect(() => { now.current = new Date() }, [])

  const greeting =
    now.current.getHours() < 12
      ? localize('Good morning')
      : now.current.getHours() < 15
        ? localize('Good afternoon')
        : now.current.getHours() < 18
          ? localize('Good evening')
          : localize('Good night')

  const timeString = now.current.toLocaleTimeString('en-US')
  const dateString = now.current.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <StyledWelcome>
      <div>{greeting} {staffname}.</div>
      <div>{localize('Today is')} {dateString}.</div>
      <div>{localize('It is now')} {timeString}.</div>
    </StyledWelcome>
  )
}

export default Welcome

const StyledWelcome = styled.div`
  background-color: ${({ theme }) => theme.bg};
  display: inline-block;
  margin: 20px;
  padding: 30px;
  box-shadow: 0 0 5px ${({ theme }) => theme.fgWeak};

  > div {
    color: ${({ theme }) => theme.fgStrong};
    margin-bottom: 5px;

    &:first-child {
      font-size: 32px;
      margin-bottom: 10px;
    }
  }
`
