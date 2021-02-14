import {RatingGroup} from 'components';
import {Input, Textarea, Checkbox} from 'icruiting-ui';
import {ItemTypes} from '../../components/FormBuilder/DnD';
import {FormCategory, FormFieldIntent} from 'services';
import {DnDItem} from 'lib/formbuilder/types';

const applicationInitialformFields: Array<DnDItem> = [
  {
    id: '1',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 0,
    as: Input,
    component: 'input',
    props: {
      name: 'name',
      placeholder: 'Vollständiger Name',
      label: 'Vollständiger Name',
      required: true,
    },
  },
  {
    id: '2',
    as: Input,
    component: 'input',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 1,
    props: {
      name: 'email',
      placeholder: 'E-Mail-Addresse',
      label: 'E-Mail-Addresse',
      type: 'email',
      required: true,
    },
  },
  {
    id: '3',
    as: Input,
    component: 'file_upload',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 2,
    props: {
      name: 'photo',
      label: 'Bewerbungsfoto (.jpeg)',
      accept: 'image/jpeg',
      type: 'file',
    },
    deletable: true,
    editable: true,
  },
];

const screeningInitialformFields: Array<DnDItem> = [
  {
    id: '1',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 0,
    as: RatingGroup,
    component: 'rating_group',
    editable: true,
    props: {
      label: 'Die Bewerbung war professionell',
      intent: FormFieldIntent.sumUp,
      name: `${Math.random().toString(36).substring(7)}`,
      defaultValue: '0',
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
    id: '2',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 1,
    as: RatingGroup,
    component: 'rating_group',
    props: {
      label: 'Gesamteindruck',
      intent: FormFieldIntent.countDistinct,
      name: `${Math.random().toString(36).substring(7)}`,
      defaultValue: 'Strong Hire',
      options: [
        {label: 'Strong Decline', value: 'Strong Decline'},
        {label: 'Decline', value: 'Decline'},
        {label: 'Hire', value: 'Hire'},
        {label: 'Strong Hire', value: 'Strong Hire'},
      ],
    },
  },
  {
    id: '3',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 2,
    component: 'checkbox',
    as: Checkbox,
    props: {
      label: 'Ich will diesen*diese Kandidanten*in besprechen',
      intent: FormFieldIntent.countDistinct,
      options: [
        {
          label: 'Ich will diesen*diese Kandidanten*in besprechen',
          value: 'Ja',
        },
      ],
      name: Math.random().toString(36).substring(7),
    },
  },
  {
    id: '4',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 3,
    component: 'textarea',
    as: Textarea,
    props: {
      intent: FormFieldIntent.aggregate,
      label: 'Anmerkungen',
      placeholder: 'Anmerkungen',
      name: Math.random().toString(36).substring(7),
    },
  },
];

const assessmentInitialformFields: Array<DnDItem> = [
  {
    id: '1',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 0,
    as: RatingGroup,
    component: 'rating_group',
    editable: true,
    props: {
      intent: FormFieldIntent.sumUp,
      label: 'Der Bewerber trägt ästhetischen Haarschmuck',
      name: `${Math.random().toString(36).substring(7)}`,
      defaultValue: '0',
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
    id: '2',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 1,
    as: RatingGroup,
    component: 'rating_group',
    props: {
      label: 'Gesamteindruck',
      intent: FormFieldIntent.countDistinct,
      name: `${Math.random().toString(36).substring(7)}`,
      defaultValue: 'Strong Hire',
      options: [
        {label: 'Strong Decline', value: 'Strong Decline'},
        {label: 'Decline', value: 'Decline'},
        {label: 'Hire', value: 'Hire'},
        {label: 'Strong Hire', value: 'Strong Hire'},
      ],
    },
  },
  {
    id: '3',
    type: ItemTypes.FORM_FIELD,
    rowIndex: 2,
    as: Textarea,
    component: 'textarea',
    props: {
      intent: FormFieldIntent.aggregate,
      label: 'Anmerkungen',
      placeholder: 'Anmerkungen',
      name: Math.random().toString(36).substring(7),
    },
  },
];

export const getInitialFormFields = (
  category: FormCategory,
): Array<DnDItem> => {
  const map = {
    screening: screeningInitialformFields,
    application: applicationInitialformFields,
    assessment: assessmentInitialformFields,
  };
  return map[category] || [];
};
