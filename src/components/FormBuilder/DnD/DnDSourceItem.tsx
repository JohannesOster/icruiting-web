import React from 'react';
import {useDrag} from 'react-dnd';
import {DnDItem} from '../types';
import styled from 'styled-components';

const Item = styled.div`
  padding: ${({theme}) =>
    `${theme.spacing.scale200} ${theme.spacing.scale300}`};
  background: ${({theme}) => theme.colors.inputBorder};
  display: flex;
  align-items: center;
  cursor: move;
  ${({theme}) => theme.typography.body}
`;

type Props = {
  item: DnDItem;
  children?: React.ReactNode;
};

/** A dragable component which acts as a source for the dnd-form builder  */
export const DnDSourceItem: React.FC<Props> = ({
  item: sourceItem,
  ...props
}) => {
  const {icon, label, ...item} = sourceItem; // ignore icon and title parameters of DnDSourceItem
  const [{isDragging}, drag] = useDrag({
    item,
    options: {dropEffect: 'copy'},
    collect: (monitor) => ({isDragging: monitor.isDragging()}),
  });

  return <Item ref={drag} style={{opacity: isDragging ? 0.5 : 1}} {...props} />;
};
