import React from 'react';

type Props = {
  children?: React.ReactNode;
  as?: string | React.ComponentType<any>;
} & React.CSSProperties;

export const Box: React.FC<Props> = ({
  children,
  as: Component = 'div',
  ...style
}) => {
  return <Component style={style}>{children}</Component>;
};
