import {ComponentType} from 'react';
import {FormSectionHeader, RatingGroup} from 'components';
import {Input, Select, Textarea, Radio, Checkbox} from 'icruiting-ui';

/** Return the actual component to the passed components name */
export const stringToComponent = (componentName: string): any => {
  const map: {[key: string]: ComponentType<any>} = {
    section_header: FormSectionHeader,
    input: Input,
    file_upload: Input,
    textarea: Textarea,
    select: Select,
    radio: Radio,
    checkbox: Checkbox,
    rating_group: RatingGroup,
  };

  const component = map[componentName];

  if (!component) throw new Error('Invalid component string');
  return component;
};

export const randString = () =>
  Math.random().toString(36).substring(7).toString();
