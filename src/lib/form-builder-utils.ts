import {ComponentType} from 'react';
import {FormSectionHeader, RatingGroup} from 'components';
import {Input, Select, Textarea, Radio, Checkbox} from 'icruiting-ui';
import queryString from 'query-string';
import {FormCategory} from 'services';

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

/** extract form category from query string */
export const getFormCategory = (query: string): FormCategory => {
  const queryParam = queryString.parse(query).formCategory || '';
  return queryParam as FormCategory;
};

export const getJobID = (query: string): string => {
  const jobId = (queryString.parse(query).jobId || '') as string;
  return jobId;
};
