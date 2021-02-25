import {RatingGroup} from 'components';
import {Input} from 'icruiting-ui';
import {ItemTypes} from '../../components/FormBuilder/DnD';
import {FormCategory, FormFieldIntent} from 'services';
import {DnDItem} from 'components/FormBuilder/types';

const applicationInitialformFields: DnDItem[] = [
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

const screeningInitialformFields: DnDItem[] = [
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
];

const assessmentInitialformFields: DnDItem[] = [
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
];

export const getInitialFormFields = (category: FormCategory): DnDItem[] => {
  const map = {
    screening: screeningInitialformFields,
    application: applicationInitialformFields,
    assessment: assessmentInitialformFields,
    onboarding: assessmentInitialformFields,
  };
  return map[category] || [];
};
