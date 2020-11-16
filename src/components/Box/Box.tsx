import React from 'react';

type Props = {children?: React.ReactNode} & React.CSSProperties;

export const Box: React.FC<Props> = ({children, ...style}) => {
  return <div style={style}>{children}</div>;
};
