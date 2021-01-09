/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'
import { Settings } from '../components/Context'

import Layout from '../components/Layout'
import Loading from '../components/Loading'

import LoginArt from '../assets/images/login_art.jpg'

const Login = (): JSX.Element => {
  const { localize } = useContext(Settings)!

  const Auth = (): JSX.Element => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
      <StyledLogin>
        <img src={LoginArt} />
        <div>
          <div>Handal Cargo</div>
          <h1>Log In</h1>
          <label>{localize('username')}</label>
          <input type="text" placeholder="Username"
            onChange={e => setUsername(e.target.value)} />
          <label>{localize('password')}</label>
          <input type="password" placeholder="Password"
            onChange={e => setPassword(e.target.value)} />
          <Button onClick={() => {
            setView(<Loading/>)
            ipcRenderer.send('login', username, password)
          }}>{localize('login')}</Button>
          <div>© Handal Cargo, All rights reserved.</div>
        </div>
      </StyledLogin>
    )
  }

  const [view, setView] = useState<JSX.Element>(<Loading/>)

  useEffect(() => {
    ipcRenderer.once('connected', () => setView(<Auth />))
    ipcRenderer.send('connect')

    ipcRenderer.once('login-success', (event, profileInfo) => {
      window.sessionStorage.setItem('Profile', JSON.stringify(profileInfo))
      setView(<Layout />)
      ipcRenderer.removeAllListeners('login-failed')
    })

    ipcRenderer.on('login-failed', () => { setView(<Auth/>) })
  }, [])

  return view
}

export default Login

const StyledLogin = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  overflow: hidden;

  > img {
    width: 100%;
  }

  > div {
    padding: 25px 50px 0 50px;

    > div:first-child {
      color: ${({ theme }) => theme.fgStrong};
      text-align: right;
      margin-bottom: 50px;
    }

    > h1 {
      color: ${({ theme }) => theme.fgStrong};
      margin-bottom: 40px;
    }

    > label {
      color: ${({ theme }) => theme.fgStrong};
      font-size: 12px;
      margin-bottom: 5px;
      display: block;
    }

    > input {
      background-color: ${({ theme }) => theme.fgWeak};
      display: block;
      border: 1px solid transparent;
      padding: 10px 15px;
      margin-bottom: 20px;

      &:focus {
        border-color: ${({ theme }) => theme.accent};
      }
    }

    > input,
    > button {
      width: 100%;
      border-radius: 10px;
    }

    > button {
      margin-bottom: 80px;
    }

    > div:last-child {
      color: ${({ theme }) => theme.fgStrong};
      text-align: center;
      font-size: 11px;
    }
  }
`

const Button = styled.button`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.accent};
  border: 1px solid ${({ theme }) => theme.accent};
  padding: 10px 20px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.bg};
  }
`
