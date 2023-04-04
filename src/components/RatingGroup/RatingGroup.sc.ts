import styled from 'styled-components';

export const StyledRatingGroup = styled.div`
  --gap: ${({theme}) => theme.spacing.scale300};
  display: inline-flex;
  flex-wrap: wrap;
  margin: calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap));
  width: calc(100% + var(--gap));

  & > * {
    margin: var(--gap) 0 0 var(--gap);
  }
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({theme}) => theme.colors.borderPrimary};
  ${({theme}) => theme.typography.body};
  padding: ${({theme}) => `${theme.spacing.scale300} ${theme.spacing.scale400}`};
  border-radius: ${({theme}) => theme.borders.radius100};
  cursor: pointer;
`;

export const Radio = styled.input`
  opacity: 0;
  position: fixed;
  width: 0;

  &:checked + ${RadioLabel} {
    background: ${({theme}) => theme.colors.surfacePrimaryDefault};
    color: white;
  }
`;
