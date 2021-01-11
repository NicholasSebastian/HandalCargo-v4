import React from 'react'
import styled from 'styled-components'

const StyledLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  
    > div {
      background-color: ${({ theme }) => theme.accent};
      display: inline-block;
      position: absolute;
      left: 8px;
      width: 16px;
      animation: load_anim 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  
      &:nth-child(1) {
        left: 8px;
        animation-delay: -0.24s;
      }
  
      &:nth-child(2) {
        left: 32px;
        animation-delay: -0.12s;
      }
  
      &:nth-child(3) {
        left: 56px;
        animation-delay: 0;
      }
    }
  
    @keyframes load_anim {
      0% {
        top: 8px;
        height: 64px;
      }
      50%,
      100% {
        top: 24px;
        height: 32px;
      }
    }
  }
`

const Loading = (): JSX.Element => {
  return (
    <StyledLoading>
      <div>
        <div />
        <div />
        <div />
      </div>
    </StyledLoading>
  )
}

export default Loading