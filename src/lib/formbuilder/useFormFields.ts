import {arrInsert, arrMove} from 'lib/utility/arrUtils';
import {useState, useRef, useCallback} from 'react';
import {DnDItem, ReturnType} from './types';

const randString = () => Math.random().toString(36).substring(7).toString();

export const useFormFields = (init: DnDItem[] = []): ReturnType => {
  const [formFields, setformFields] = useState(init);

  /**
   * Helper function to reasign the array index of a formField to its internal formField.
   * This might be used as a param for a .map function after reordering the formFields.
   */
  const assignRowIndex = (field: DnDItem, index: number) => {
    field.rowIndex = index;
    return field;
  };

  const move = useCallback(
    (from: number, to: number) => {
      setformFields((items) => arrMove(items, from, to).map(assignRowIndex));
    },
    [formFields],
  );

  /**
   *  Holds the idea of the currently dragged new Item from the DnDSourceSection.
   *  This is used to be able to remove the item if it moves outside the actual Formsection.
   *  The default value is null. Only if a new item is added and currently dragged, this ref
   *  will hold the coresponding id. To avoid weird behaviour this must be set back to null
   *  once the item is dropped. Otherwise the newest item will be removed if it is dragged outside after the
   *  inital drop.
   */
  const currentNewItemId = useRef<null | number>(null);

  /** The current method of generating unique ids */
  const idCounter = useRef(init.length);

  /**
   * This function will be called if an item of the DnDSource section
   * hovers the form sectoin.
   * */
  const insert = useCallback((item: DnDItem, index: number) => {
    const tmp = {
      type: item.type,
      rowIndex: index,
      id: `${++idCounter.current}`,
      component: item.component,
      as: item.as,
      props: {...item.props, name: randString()}, // otherwise reference is passed and next source items would point on same properties
      deletable: true,
      editable: true,
    };

    currentNewItemId.current = idCounter.current;

    setformFields((items) => arrInsert(items, tmp, index).map(assignRowIndex));
  }, []);

  const duplicate = useCallback(
    (id: string) => {
      const original = formFields.find((item) => item.id === id);
      if (!original) return;

      const duplicate = {...original, id: '', index: -1};
      delete duplicate.formFieldId;

      insert(duplicate, original.rowIndex + 1);
      currentNewItemId.current = null;
    },
    [insert, formFields],
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

  const del = useCallback((id: string) => {
    setformFields((items) =>
      items.filter((item) => item.id !== id).map(assignRowIndex),
    );
  }, []);

  const edit = useCallback((id: string, values: {[key: string]: string}) => {
    setformFields((items) =>
      /* map through all existing form items
       * to filter the one to edit by its id */
      items.map((item) => {
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
  }, []);

  return {
    fields: formFields,
    insert,
    edit,
    move,
    delete: del,
    duplicate,
    reset: setformFields,
    onOutsideHover,
    onDrop,
  };
};
