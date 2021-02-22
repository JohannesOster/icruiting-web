// import {FormFieldComponent} from 'pages/Dashboard/Jobs/FormBuilder/types';
type FormFieldComponent = string;
export type FormCategory =
  | 'application'
  | 'screening'
  | 'assessment'
  | 'onboarding';
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
  replicaOf?: string;
};

export type TFormRequest = {
  formId: string;
  formCategory: FormCategory;
  formTitle?: string;
  jobId: string;
  formFields: FormFieldBase[];
  replicaOf?: string;
};
