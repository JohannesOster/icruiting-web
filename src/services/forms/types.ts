import {FormFieldComponent} from 'pages/Dashboard/Jobs/FormBuilder/types';

export type FormCategory = 'application' | 'screening' | 'assessment';
export enum FormFieldIntent {
  aggregate = 'aggregate',
  countDistinct = 'count_distinct',
  sumUp = 'sum_up',
}

type FormFieldBase = {
  rowIndex: number;
  component: FormFieldComponent;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  description?: string;
  required?: boolean;
  options?: Array<{label: string; value: string}>;
  editable?: boolean;
  deletable?: boolean;
  jobRequirementId?: string;
  intent?: FormFieldIntent;
  props?: {[key: string]: any};
};

export type FormField = {formId: string; formFieldId: string} & FormFieldBase;

export type TForm = {
  formId: string;
  formCategory: FormCategory;
  formTitle?: string;
  jobId: string;
  formFields: FormField[];
};

export type TFormRequest = {
  formId: string;
  formCategory: FormCategory;
  formTitle?: string;
  jobId: string;
  formFields: Array<FormFieldBase>;
};
