import styled from 'styled-components'

const Button = styled.button`
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

export default Button
