/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import styled from 'styled-components'

const Profile = (): JSX.Element => {
  const profile = JSON.parse(window.sessionStorage.getItem('Profile')!)
  return (
    <StyledProfile>
      <div>Name: {profile.staffid}</div>
    </StyledProfile>
  )
}

export default Profile

const StyledProfile = styled.div`
  background-color: ${({ theme }) => theme.bg};
  display: inline-block;
  margin: 20px;
  padding: 30px;
  box-shadow: 0 0 5px ${({ theme }) => theme.fgWeak};
`
