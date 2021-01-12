/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { memo, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCalculator, faStickyNote, faAngleDown } from '@fortawesome/free-solid-svg-icons'

import { Settings } from './Context'
import { TabControl } from './Layout'
import NoPhoto from '../assets/images/no-photo.png'

const ProfileButton = (): JSX.Element => {
  const { staffid, groupname, profilepic } = JSON.parse(window.sessionStorage.getItem('Profile')!)
  const username = useRef(staffid)
  const staffGroup = useRef(groupname)
  const photo = useRef(profilepic)

  return (
    <StyledProfile>
      <div>
        <div>{username.current}</div>
        <div>{staffGroup.current}</div>
      </div>
      <div><img src={photo.current || NoPhoto} /></div>
      <FontAwesomeIcon icon={faAngleDown} />
      <ProfileDropDown />
    </StyledProfile>
  )
}

const ProfileDropDown = (): JSX.Element => {
  const { lang, theme, setLang, setTheme, localize } = useContext(Settings)!
  const updateTab = useContext(TabControl)!
  return (
    <StyledDropdown>
      <Link to='/profile' onClick={() => updateTab('Profile')}>
        {localize('viewProfile')}
      </Link>
      <button onClick={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}>
        {localize('theme')}: {theme}
      </button>
      <button onClick={() => setLang(lang === 'en' ? 'id' : 'en')}>
        {localize('language')}: {lang.toUpperCase()}
      </button>
      <hr/>
      <button onClick={() => ipcRenderer.send('logout')}>
        {localize('logoutExit')}
      </button>
    </StyledDropdown>
  )
}

const Header = (): JSX.Element => {
  return (
    <StyledHeader>
      <HeaderButton><FontAwesomeIcon icon={faEnvelope} /></HeaderButton>
      <HeaderButton><FontAwesomeIcon icon={faCalculator} /></HeaderButton>
      <HeaderButton><FontAwesomeIcon icon={faStickyNote} /></HeaderButton>
      <ProfileButton />
    </StyledHeader>
  )
}

export default memo(Header)

const StyledHeader = styled.div`
  background-color: ${({ theme }) => theme.bg};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const HeaderButton = styled.button`
  background: none;
  border: none;
  margin-top: 2px;
  margin-right: 2px;

  > svg {
    color: ${({ theme }) => theme.fgMid};
    font-size: 20px;
  }

  &:hover > svg {
    cursor: pointer;
    color: ${({ theme }) => theme.fgStrong}
  }
`

const StyledProfile = styled.div`
  background: none;
  height: 100%;
  border: none;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-left: 5px;
  position: relative;
  text-decoration: none;

  > div:first-of-type {
    text-align: right;

    > div:first-child { 
      color: ${({ theme }) => theme.fgStrong};
      font-size: 13px; 
    }

    > div:last-child { 
      color: ${({ theme }) => theme.fgMid};
      font-size: 10px; 
    }
  }

  > div:last-of-type {
    background-color: ${({ theme }) => theme.fgMid};
    width: 35px;
    height: 35px;
    border-radius: 20px;
    margin-left: 10px;
    margin-right: 8px;
    overflow: hidden;

    > img {
      height: 100%;
    }
  }

  > svg:last-of-type {
    color: ${({ theme }) => theme.fgMid};
    font-size: 14px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.fgWeak};

    > section {
      display: block !important;
    }
  }
`

const StyledDropdown = styled.section`
  background-color: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.fgWeak};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 180px;
  padding: 8px;
  display: none;
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 1;

  > button, a {
    background: none;
    color: ${({ theme }) => theme.fgStrong};
    display: block;
    width: 100%;
    border: none;
    border-radius: 5px;
    padding: 7px 0;
    font-size: 12px;
    text-align: center;
    text-decoration: none;

    &:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.fgWeak};
    }
  }
`
