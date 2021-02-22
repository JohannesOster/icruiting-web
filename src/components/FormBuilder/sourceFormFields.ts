import {ItemTypes} from '../../components/FormBuilder/DnD';
import {RatingGroup, FormSectionHeader} from 'components';
import {Input, Select, Textarea, Radio, Checkbox} from 'icruiting-ui';
import {
  Area,
  Select as SelectIcon,
  Radio as RadioIcon,
  Shell,
  Rating,
  Upload,
  Checkbox as CheckboxIcon,
  Heading,
} from 'icons';
import {FormFieldIntent, FormCategory} from 'services';
import {DnDItem} from 'lib/formbuilder/types';

const DNDBase = {
  type: ItemTypes.FORM_FIELD,
  id: '',
  rowIndex: -1,
};

const applicationFormSourceFields: Array<DnDItem> = [
  {
    ...DNDBase,
    label: 'Section Header',
    icon: Heading,
    as: FormSectionHeader,
    component: 'section_header',
    props: {
      label: 'Abschnittsüberschrift',
      description: 'Abschnittsberschreibungstext',
    },
  },
  {
    ...DNDBase,
    icon: Shell,
    label: 'Textfeld',
    as: Input,
    component: 'input',
    props: {placeholder: 'Textfeld', label: 'Textfeld', type: 'text'},
  },
  {
    ...DNDBase,
    icon: Area,
    label: 'Textarea',
    as: Textarea,
    component: 'textarea',
    props: {label: 'Textarea', placeholder: 'Textarea'},
  },
  {
    ...DNDBase,
    icon: SelectIcon,
    label: 'Select',
    as: Select,
    component: 'select',
    props: {
      label: 'Select',
      options: [
        {label: 'Option-1', value: 'Option-1'},
        {label: 'Option-2', value: 'Option-2'},
      ],
    },
  },
  {
    ...DNDBase,
    icon: RadioIcon,
    label: 'Radio',
    as: Radio,
    component: 'radio',
    props: {
      label: 'Radio',
      options: [
        {label: 'Option-1', value: 'Option-1'},
        {label: 'Option-2', value: 'Option-2'},
      ],
    },
  },
  {
    ...DNDBase,
    icon: CheckboxIcon,
    label: 'Checkbox',
    as: Checkbox,
    component: 'checkbox',
    props: {
      label: 'Checkbox',
      options: [
        {label: 'Option-1', value: 'Option-1'},
        {label: 'Option-2', value: 'Option-2'},
      ],
    },
  },
  {
    ...DNDBase,
    icon: Upload,
    label: 'Fileupload',
    as: Input,
    component: 'file_upload',
    props: {
      type: 'file',
      label: 'Fileupload',
      accept: 'application/pdf',
    },
  },
];

const screeningSourceFields: Array<DnDItem> = [
  {
    ...DNDBase,
    icon: Rating,
    label: 'Rating',
    as: RatingGroup,
    component: 'rating_group',
    props: {
      label: 'Rating',
      intent: FormFieldIntent.sumUp,
      name: `${Math.random().toString(36).substring(7)}`,
      options: [
        {label: '0', value: '0'},
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
      ],
    },
  },
  {
    ...DNDBase,
    icon: Area,
    label: 'Textarea',
    as: Textarea,
    component: 'textarea',
    props: {
      label: 'Textarea',
      placeholder: 'Textarea',
      intent: FormFieldIntent.aggregate,
    },
  },
];

const assessmentSourceFields: Array<DnDItem> = [
  {
    ...DNDBase,
    icon: Rating,
    label: 'Rating',
    as: RatingGroup,
    component: 'rating_group',
    props: {
      intent: FormFieldIntent.sumUp,
      label: 'Rating',
      name: `${Math.random().toString(36).substring(7)}`,
      options: [
        {label: '0', value: '0'},
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
      ],
    },
  },
  {
    ...DNDBase,
    icon: Area,
    label: 'Textarea',
    as: Textarea,
    component: 'textarea',
    props: {
      label: 'Textarea',
      placeholder: 'Textarea',
      intent: FormFieldIntent.aggregate,
    },
  },
];

export const getSourceFormFields = (category: FormCategory): Array<DnDItem> => {
  const map = {
    screening: screeningSourceFields,
    application: applicationFormSourceFields,
    assessment: assessmentSourceFields,
    onboarding: assessmentSourceFields,
  };
  return map[category] || [];
};
