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
      placeholder: 'E-Mail-Adresse',
      label: 'E-Mail-Adresse',
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
    props: {
      label: 'Die Bewerbung war professionell',
      intent: FormFieldIntent.sumUp,
      name: `${Math.random().toString(36).substring(7)}`,
      required: true,
      options: [
        {label: '0', value: '0'},
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
      ],
    },
    editable: true,
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
      required: true,
      options: [
        {label: 'Strong Decline', value: 'Strong Decline'},
        {label: 'Decline', value: 'Decline'},
        {label: 'Hire', value: 'Hire'},
        {label: 'Strong Hire', value: 'Strong Hire'},
      ],
    },
    deletable: true,
    editable: true,
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
    deletable: true,
    editable: true,
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
    editable: true,
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
      required: true,
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
      required: true,
      defaultValue: 'Strong Hire',
      options: [
        {label: 'Strong Decline', value: '0'},
        {label: 'Decline', value: '1'},
        {label: 'Hire', value: '2'},
        {label: 'Strong Hire', value: '3'},
      ],
    },
    deletable: true,
    editable: true,
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
    editable: true,
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
