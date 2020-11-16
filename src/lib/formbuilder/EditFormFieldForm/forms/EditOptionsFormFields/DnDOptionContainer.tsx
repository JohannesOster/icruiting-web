import React, {FC, useRef} from 'react';
import {useTheme} from 'styled-components';
import {useDrag, useDrop, XYCoord} from 'react-dnd';
import {Move, Trash} from 'icons';
import {ActionBar, OptionContainer} from './DnDOptionContainer.sc';
import {ItemType, DnDOptionContainerProps, DragItem} from './types';

export const DnDOptionContainer: FC<DnDOptionContainerProps> = ({
  index,
  move,
  onDelete,
  children,
}) => {
  const {spacing} = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: DragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Time to actually perform the action
      move(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{opacity}, drag, preview] = useDrag({
    item: {type: ItemType, index},
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.6 : 1,
    }),
  });

  preview(drop(ref));

  return (
    <OptionContainer ref={ref} style={{opacity}}>
      {children}
      <ActionBar style={{marginLeft: spacing.scale200}}>
        <div ref={drag} style={{cursor: 'move'}}>
          <Move style={{width: 'auto', height: spacing.scale200}} />
        </div>
        {onDelete && (
          <div
            style={{cursor: 'pointer'}}
            onClick={() => {
              onDelete(index);
            }}
          >
            <Trash style={{width: 'auto', height: spacing.scale200}} />
          </div>
        )}
      </ActionBar>
    </OptionContainer>
  );
};
