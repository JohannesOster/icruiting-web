import React, {useRef} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {XYCoord} from 'dnd-core';
import {ItemTypes} from './ItemTypes';
import {DnDItem} from '../types';
import {Move, Trash, Edit, Duplicate} from 'icons';
import styled, {useTheme} from 'styled-components';

/** Absolute positioned top right bar with options */
const OptionBar = styled.div`
  position: absolute;
  right: 0;
  top: -${({theme}) => theme.spacing.scale500};
  background: white;
  box-shadow: 1px 1px 5px 0px rgba(64, 64, 64, 0.3);
  border-radius: ${({theme}) => theme.borders.radius100};
  display: grid;
  grid-auto-flow: column;

  div {
    height: ${({theme}) => theme.spacing.scale600};
    width: ${({theme}) => theme.spacing.scale600};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

type Props = {
  /** A unique identifier for the DnD item */
  id: string;
  /** The current index in the form */
  rowIndex: number;
  /**
   * A function wich will be called if an existing item moves down or upwords.
   * @params dragIndex  The initial index of the dragged item
   * @params hoverIndex The index of the hovered item
   */
  onMove: (dragIndex: number, hoverIndex: number) => void;
  /**
   * A function wich will be called if a new item moves over an existing one.
   * @params item   The dragged item
   * @params index  The index of the hovered item
   */
  addItem: (item: DnDItem, index: number) => void;
  onDuplicate: (id: string) => void;
  children: React.ReactNode;
  /**
   * A function wich will be called if the delete button is pressed.
   * The delete button will only be displayed if this function is provided.
   * @params id The id of the item to delete
   */
  onDelete?: (id: string) => void;
  /**
   * A function wich will be called if the edit button is pressed.
   * The edit button will only be displayed if this function is provided.
   * @params id The id of the item to edit
   */
  onEdit?: (id: string) => void;
};

export const DnDFormField: React.FC<Props> = ({
  id,
  children,
  rowIndex,
  onMove,
  addItem,
  onDelete,
  onEdit,
  onDuplicate,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const {spacing} = useTheme();

  /* The following section was hardly inspired by
     https://react-dnd.github.io/react-dnd/examples/sortable/simple */
  const [, drop] = useDrop({
    accept: ItemTypes.FORM_FIELD,
    hover(item: DnDItem, monitor) {
      if (!ref.current) return;

      // A new item is hovering this
      if (item.rowIndex === -1) {
        addItem({...item}, rowIndex);
        item.rowIndex = rowIndex; // update index to avoid readding item
        return;
      }

      const dragIndex = item.rowIndex;
      const hoverIndex = rowIndex;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle of the hovered element (this)
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Difference between mouse position and hoverd item top in px
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards but hasn't exceed middel of hovered item
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

      // Dragging upwards but hasn't exceed middel of hovered item
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.rowIndex = hoverIndex;
    },
  });

  const [{isDragging}, drag, preview] = useDrag({
    item: {type: ItemTypes.FORM_FIELD, id, rowIndex},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(ref);
  preview(ref);

  return (
    <div
      ref={ref}
      style={{position: 'relative', opacity: isDragging ? 0.6 : 1}}
    >
      <OptionBar>
        <div ref={drag} style={{cursor: 'move'}}>
          <Move style={{width: 'auto', height: spacing.scale300}} />
        </div>
        {onEdit && (
          <>
            <div style={{cursor: 'pointer'}} onClick={() => onDuplicate(id)}>
              <Duplicate style={{width: 'auto', height: spacing.scale300}} />
            </div>
            <div
              style={{cursor: 'pointer'}}
              onClick={() => {
                onEdit(id);
              }}
            >
              <Edit style={{width: 'auto', height: spacing.scale300}} />
            </div>
          </>
        )}
        {onDelete && (
          <div
            style={{cursor: 'pointer'}}
            onClick={() => {
              onDelete(id);
            }}
          >
            <Trash style={{width: 'auto', height: spacing.scale300}} />
          </div>
        )}
      </OptionBar>
      {children}
    </div>
  );
};
