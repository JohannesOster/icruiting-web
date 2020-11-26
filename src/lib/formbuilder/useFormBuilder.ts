import {useState, useRef, useCallback} from 'react';
import {DnDItem, ReturnType} from './types';

interface Params {
  initialformFields?: DnDItem[];
}
export const useFormBuilder: (params: Params) => ReturnType = ({
  initialformFields = [],
}) => {
  const [formFields, setformFields] = useState<DnDItem[]>(initialformFields);

  const reset = (formFields: DnDItem[]) => {
    setformFields(formFields);
  };

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragItem = formFields[dragIndex];
      setformFields((items) => {
        const tmp = [...items];
        tmp.splice(dragIndex, 1);
        tmp.splice(hoverIndex, 0, dragItem);
        return tmp.map((item, index) => {
          item.rowIndex = index;
          return item;
        });
      });
    },
    [formFields],
  );

  /** Holds the idea of the currently dragged new Item from the DnDSourceSection.
   *  This is used to be able to remove the item if it moves outside the actual Formsection.
   *  The default value is null. Only if a new item is added and currently dragged this ref
   *  will hold the coresponding id. To avoid weird behaviour this must be set back to null
   *  once the item is dropped. Otherwise it will be removed it is dragged outside after the
   *  inital drop.
   */
  const currentNewItemId = useRef<null | number>(null);

  /** The current method of generating unique ids */
  const idCounter = useRef(initialformFields?.length || 0);

  /** This function will be called if an item of the DnDSource section
   * hovers the form sectoin. Since new items should be deletable, the
   * deletable prop is passed to the tmp item. */
  const addItem = useCallback((item: DnDItem, rowIndex: number) => {
    const tmp = {
      type: item.type,
      rowIndex: rowIndex,
      id: `${++idCounter.current}`,
      component: item.component,
      as: item.as,
      props: {...item.props}, // otherwise reference is passed and next source items would point on same properties
      deletable: true,
      editable: true,
    };
    // set unique name
    tmp.props.name = `${Math.random().toString(36).substring(7)}`;

    currentNewItemId.current = idCounter.current;

    setformFields((items) => {
      const copy = [...items];
      copy.splice(rowIndex, 0, tmp);
      return copy.map((item, index) => {
        item.rowIndex = index;
        return item;
      });
    });
  }, []);

  const duplicateItem = useCallback(
    (id: string) => {
      const original = formFields.find((item) => item.id === id);
      if (!original) return;

      const duplicate = {...original, id: '', index: -1};
      delete duplicate.formFieldId;

      addItem(duplicate, original.rowIndex + 1);
      currentNewItemId.current = null;
    },
    [addItem, formFields],
  );

  const onOutsideHover = useCallback((item: DnDItem) => {
    if (currentNewItemId.current) {
      item.rowIndex = -1;
      setformFields((items) =>
        items.filter((curr) => parseInt(curr.id) !== currentNewItemId.current),
      );
      currentNewItemId.current = null;
    }
  }, []);

  /** If the DnDSource item drops this handler will be called.
   *  It resets the currentNewItemId in order to avoid following scenario:
   *  Source item drops in form section, will be redragged outside the form section and
   *  filtered out in the onOutsideHover handler.
   */
  const onDrop = () => {
    const tmp = currentNewItemId.current;
    currentNewItemId.current = null;
    return tmp;
  };

  const deleteItem = useCallback((id: string) => {
    setformFields((items) =>
      items
        .filter((item) => item.id !== id)
        .map((item, index) => {
          item.rowIndex = index;
          return item;
        }),
    );
  }, []);

  const editItem = useCallback(
    (id: string, values: {[key: string]: string}) => {
      setformFields((items) =>
        /* map through all existing form items
         * to filter the one to edit by its id */
        items.map((item: DnDItem) => {
          // if isn't the one to edit, do nothing
          if (item.id !== id) return item;
          /* Else go through all values to update by key */
          Object.keys(values).forEach((key) => {
            // actually update the value
            item.props[key] = values[key];
          });

          return item;
        }),
      );
    },
    [],
  );

  return {
    formFields,
    reset,
    moveItem,
    addItem,
    duplicateItem,
    deleteItem,
    editItem,
    onOutsideHover,
    onDrop,
  };
};
