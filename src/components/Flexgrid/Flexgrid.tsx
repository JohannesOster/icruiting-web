import React, {ReactNode, CSSProperties} from 'react';
import styled from 'styled-components';

interface Props extends CSSProperties {
  children?: ReactNode;
  flexGap?: string;
}

const FlexgridBase = styled.div<{flexGap?: string}>`
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;

  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  position: relative;

  ${({flexGap}) => `
    margin: calc(-1 * ${flexGap}) 0 0 calc(-1 * ${flexGap});
    width: calc(100% + ${flexGap});
  `};

  & > * {
    ${({flexGap}) => `margin: ${flexGap} 0 0 ${flexGap}`};
  }
`;

export const Flexgrid: React.FC<Props> = ({children, flexGap, ...style}) => {
  return (
    <FlexgridBase flexGap={flexGap} style={style}>
      {children}
    </FlexgridBase>
  );
};
