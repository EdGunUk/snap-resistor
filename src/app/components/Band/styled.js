import styled from 'styled-components';

export const Group = styled.g`
  transform: ${({translateY}) => `translateY(${translateY}px)`};
`