import {TFormSubmission, TFormSubmissionRequest} from './types';
import API from '../request';

export const FormSubmissions = () => {
  const find = (
    formId: string,
    applicantId: string,
  ): Promise<TFormSubmission | undefined> => {
    return API.get(`/form-submissions/${formId}/${applicantId}`);
  };

  const create = (
    submission: TFormSubmissionRequest,
  ): Promise<TFormSubmission> => {
    return API.post('/form-submissions', {body: submission});
  };

  const update = (
    submission: TFormSubmissionRequest,
  ): Promise<TFormSubmission> => {
    const {formSubmissionId} = submission;
    return API.put(`/form-submissions/${formSubmissionId}`, {
      body: submission,
    });
  };

  const del = (formSubmissionId: string) => {
    return API.del(`/form-submissions/${formSubmissionId}`);
  };

  return {find, create, update, del};
};
