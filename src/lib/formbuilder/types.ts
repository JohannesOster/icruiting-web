import {ComponentType} from 'react';
import {FormCategory} from 'services';

export type FormFieldComponent =
  | 'section_header'
  | 'input'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file_upload'
  | 'rating_group';

export type DnDItem = {
  id: string;
  formFieldId?: string;
  type: string; // React-dnd type identifier
  /** The index of the current item in its list.
   * -1 if it isn't part of a list */
  rowIndex: number;
  component: FormFieldComponent;
  as: ComponentType<any>;
  props: {[key: string]: any};
  label?: string;
  icon?: ComponentType<any>;
  deletable?: boolean;
  editable?: boolean;
};

export type ComponentToEdit = {
  id: string;
  component: FormFieldComponent;
  props: {[key: string]: any};
};

export interface FormBuilderQuery {
  formId?: string;
  formCategory?: FormCategory;
}

export interface FormBuilderParams {
  jobId: string;
}

export interface ReturnType {
  formFields: DnDItem[];

  /** A function wich should be called if an existing item moves down or upwords.
   * @params dragIndex  The initial index of the dragged item
   * @params hoverIndex The index of the hovered item
   */
  move: (dragIndex: number, hoverIndex: number) => void;
  /** A function wich should be called if a new item moves over an existing one.
   * @params item   The dragged item
   * @params index  The index of the hovered item
   */
  insert: (item: DnDItem, index: number) => void;
  /** A function wich should be called if the delete button is pressed.
   * The delete button will only be displayed if this function is provided.
   * @params id The id of the item to delete */
  del?: (id: string) => void;
  /** A function wich should be called if the edit button is pressed.
   * The edit button will only be displayed if this function is provided.
   * @params id The id of the item to edit
   * @params and object of key value pairs to update */
  edit?: (id: string, values: {[key: string]: string}) => void;
  duplicate: (id: string) => void;
  /** A function wich should be called if an items moves outside its target area. */
  onOutsideHover: (item: DnDItem) => void;
  /** A function wich should be called if an item is dropped.
   * @returns number | null the id of the currentNewItemId if the droped item comes from the source, null otherwise
   */
  onDrop: () => number | null;
  reset: (formFields: DnDItem[]) => void;
}
