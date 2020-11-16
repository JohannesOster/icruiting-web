import React from 'react';
import {ComponentToEdit} from '../types';
import {Typography} from 'components';
import {
  EditInputFormFieldsForm,
  EditRatingGroupFormFields,
  EditFileUploadFormFields,
  EditOptionsFormFields,
  EditACRatingGroupFormFields,
  EditSectionHeaderFormFieldsForm,
} from './forms';
import {FormCategory, TJob} from 'services';

type Props = {
  /** The component and props to edit */
  componentToEdit: ComponentToEdit;
  /** A handler for form submission
   * @params values the values from the edit form
   */
  onSubmit: (values: any) => void;
  /** Category of the form that currently edited (relevant for AC vs screening) */
  formCategory: FormCategory;
  /** The job this form refers to (relevant for AC) */
  job: TJob;
};

export const EditFormFieldForm: React.FC<Props> = ({
  componentToEdit,
  onSubmit,
  formCategory,
  job,
}) => {
  const {component, props} = componentToEdit;

  switch (component) {
    case 'section_header':
      return (
        <EditSectionHeaderFormFieldsForm
          onSubmit={onSubmit}
          label={props.label}
          description={props.description}
        />
      );
    case 'input':
    case 'textarea':
      return (
        <EditInputFormFieldsForm
          onSubmit={onSubmit}
          label={props.label}
          placeholder={props.placeholder}
          description={props.description}
          required={props.required}
          type={props.type}
        />
      );
    case 'rating_group':
      return formCategory === 'assessment' ? (
        <EditACRatingGroupFormFields
          onSubmit={onSubmit}
          label={props.label}
          description={props.description}
          options={props.options}
          jobRequirementId={props.jobRequirementId}
          jobRequirementOptions={(job.jobRequirements || []).map((req) => ({
            label: req.requirementLabel,
            value: req.jobRequirementId,
          }))}
        />
      ) : (
        <EditRatingGroupFormFields
          onSubmit={onSubmit}
          label={props.label}
          description={props.description}
          options={props.options}
        />
      );
    case 'file_upload':
      return (
        <EditFileUploadFormFields
          onSubmit={onSubmit}
          label={props.label}
          description={props.description}
          required={props.required}
          accept={props.accept}
        />
      );
    case 'checkbox':
    case 'radio':
    case 'select':
      return (
        <EditOptionsFormFields
          onSubmit={onSubmit}
          label={props.label}
          options={props.options}
          description={props.description}
          required={props.required}
          acceptEmptyOption={component === 'select'}
        />
      );

    default:
      return (
        <Typography>Diese Funktion wird noch nicht unterstützt</Typography>
      );
  }
};
