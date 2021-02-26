import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.3);
  z-index: 30;
`;

export const ContentBackground = styled.div`
  box-sizing: border-box;
  background: white;
  position: absolute;
  max-height: calc(100vh - 210px);
  overflow-y: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: ${({theme}) => theme.spacing.scale500};
  min-width: 200px;

  @media (max-width: 568px) {
    overflow: scroll;
    max-height: 100vh;
    height: 100vh;
    width: 100vw;
  }
`;

export const Close = styled.span`
  position: absolute;
  display: flex;
  cursor: pointer;
  top: 0;
  right: 0;
  padding: ${({theme}) => theme.spacing.scale100};

  svg {
    stroke: black;
    stroke-width: 3px;
    height: 25px;
    width: 25px;
  }
`;
