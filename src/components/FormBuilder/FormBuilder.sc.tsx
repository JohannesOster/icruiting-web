import styled from 'styled-components';

export const DragAndDropList = styled.div`
  display: grid;
  grid-row-gap: ${({theme}) => theme.spacing.scale100};
  margin-top: ${({theme}) => theme.spacing.scale100};
`;

export const IconContainer = styled.span`
  width: ${({theme}) => theme.spacing.scale500};
  display: inline-flex;
  align-items: center;
`;

export const ButtonGroup = styled.div`
  margin-left: auto;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: ${({theme}) => theme.spacing.scale200};
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const DnDSourceSection = styled.section`
  border: 1px solid ${({theme}) => theme.colors.inputBorder};
  border-radius: ${({theme}) => theme.borders.radius100};
  padding: ${({theme}) => theme.spacing.scale100};
  margin-left: ${({theme}) => theme.spacing.scale100};
  width: 250px;
  z-index: 2;
`;

export const DnDTargetSection = styled.section`
  border: 1px solid ${({theme}) => theme.colors.inputBorder};
  border-radius: ${({theme}) => theme.borders.radius100};
  padding: ${({theme}) => theme.spacing.scale100};
  padding-top: ${({theme}) => theme.spacing.scale400};
  width: 100%;
  z-index: 2;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-row-gap: ${({theme}) => theme.spacing.scale500};
  margin-top: ${({theme}) => theme.spacing.scale100};
`;

export const FormCodeTextarea = styled.textarea`
  border: 1px solid;
  border-color: ${({theme}) => theme.colors.inputBorder};
  overflow: hidden;
  cursor: pointer;
  resize: none;
  color: ${({theme}) => theme.colors.typographySecondary};
  ${({theme}) => theme.typography.font100};
`;
