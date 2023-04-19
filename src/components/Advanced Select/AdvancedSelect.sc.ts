import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const ConentContainer = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.scale600};
  width: 100%;
  padding: ${({theme}) => theme.spacing.scale300};

  border: 1px solid ${({theme}) => theme.colors.inputBorder};
  border-radius: ${({theme}) => theme.borders.radius100};
  background: white;

  ${({theme}) => theme.typography.bodySmall};
`;

export const Select = styled.select`
  ${({theme}) => theme.typography.bodySmall};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100%;
  height: 100%;
  opacity: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
`;

export const Label = styled.label`
  ${({theme}) => theme.typography.bodySmall};
  color: ${({theme}) => theme.colors.textSubdued};
`;
