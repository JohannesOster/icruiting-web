import styled from 'styled-components';

export const Form = styled.form`
  display: grid;
  grid-row-gap: ${({theme}) => theme.spacing.scale200};
  width: 70vw;
  min-width: 250px;
`;
