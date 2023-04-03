import {useCallback} from 'react';
import {ItemTypes} from './DnD';
import {FormFieldComponent} from './types';
import {Input} from 'components/Input';
import {v4 as uuidv4} from 'uuid';

export const keyMap = {
  INSERT: 'i',
  MOVE_UP: ['k', 'up'],
  MOVE_DOWN: ['j', 'down'],
  MOVE_SELECTION_UP: ['shift+k', 'shift+up'],
  MOVE_SELECTION_DOWN: ['shift+j', 'shift+down'],
  DUPLICATE: 'd',
  DELETE: ['del', 'backspace'],
  EDIT: 'enter',
  SAVE_FORM: 's',
};

export const getHandlers = (formFields) => ({
  INSERT: useCallback(() => {
    const newField = {
      id: uuidv4(),
      type: ItemTypes.FORM_FIELD,
      rowIndex: formFields.fields.length,
      component: 'input' as FormFieldComponent,
      as: Input,
      props: {label: 'Neues Feld', required: false, placeholder: ''},
    };

    formFields.insert(newField, formFields.fields.length);
  }, []),
  MOVE_UP: useCallback(() => {
    console.log('Move up');
  }, []),
  MOVE_DOWN: useCallback(() => {
    console.log('Move up');
  }, []),
  MOVE_SELECTION_UP: useCallback(() => {
    console.log('Move selection up');
  }, []),
  MOVE_SELECTION_DOWN: useCallback(() => {
    console.log('Move selection down');
  }, []),
  DUPLICATE: useCallback(() => {
    console.log('Duplicate');
  }, []),
  DELETE: useCallback(() => {
    console.log('Delete');
  }, []),
  EDIT: useCallback(() => {
    console.log('Edit');
  }, []),
  SAVE_FORM: useCallback(() => {
    console.log('Save form');
  }, []),
});
