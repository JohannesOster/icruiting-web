import {FormField} from 'services';
import {ItemTypes} from './DnD';
import {DnDItem, FormFieldComponent} from '../../lib/formbuilder/types';
import {stringToComponent} from '../../lib/formbuilder/utils';

export const converter = {
  toDnDItem: (formField: FormField): DnDItem => {
    const _form_field: DnDItem = {
      type: ItemTypes.FORM_FIELD,
      id: formField.formFieldId,
      formFieldId: formField.formFieldId,
      component: formField.component as FormFieldComponent,
      as: stringToComponent(formField.component),
      rowIndex: formField.rowIndex,
      props: {
        ...formField.props,
        description: formField.description,
        label: formField.label,
        name: formField.formFieldId,
        placeholder: formField.placeholder,
        defaultValue: formField.defaultValue,
        options: formField.options,
        required: !!formField.required,
      },
      editable: formField.editable,
      deletable: formField.deletable,
    };

    if (formField.required) _form_field.props.required = !!formField.required;
    if (formField.options) _form_field.props.options = formField.options;
    if (formField.jobRequirementId)
      _form_field.props.jobRequirementId = formField.jobRequirementId;
    if (formField.intent) _form_field.props.intent = formField.intent;

    return _form_field;
  },
  toAPIFormField: (formField: DnDItem) => {
    const {
      label,
      placeholder,
      description,
      defaultValue,
      options,
      required,
      jobRequirementId,
      intent,
      ...props
    } = formField.props;

    return {
      formFieldId: formField.formFieldId,
      component: formField.component,
      rowIndex: formField.rowIndex,
      label,
      placeholder,
      description,
      defaultValue,
      options,
      required: !!required,
      editable: formField.editable,
      deletable: formField.deletable,
      jobRequirementId,
      intent,
      props,
    };
  },
};
