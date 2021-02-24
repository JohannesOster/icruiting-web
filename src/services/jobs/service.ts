import {TJob, TJobRequest, TReport} from './types';
import API from '../request';

export const Jobs = () => {
  const list = async (): Promise<TJob[]> => {
    return API.get('/jobs');
  };

  const find = (jobId: string): Promise<TJob | undefined> => {
    return API.get(`/jobs/${jobId}`);
  };

  const create = (job: TJobRequest): Promise<TJob> => {
    return API.post('/jobs', {body: job});
  };

  const update = (job: TJob): Promise<TJob> => {
    return API.put(`/jobs/${job.jobId}`, {body: job});
  };

  const del = (jobId: string): Promise<undefined> => {
    return API.del(`/jobs/${jobId}`);
  };

  const createReport = (
    jobId: string,
    formFields: string[],
  ): Promise<TReport> => {
    return API.post(`/jobs/${jobId}/report`, {body: formFields});
  };

  const retrieveReport = (jobId: string): Promise<TReport> => {
    return API.get(`/jobs/${jobId}/report`);
  };

  const updateReport = (
    jobId: string,
    formFields: string[],
  ): Promise<TReport> => {
    return API.put(`/jobs/${jobId}/report`, {body: formFields});
  };

  const delReport = (jobId: string): Promise<null> => {
    return API.del(`/jobs/${jobId}/report`);
  };

  return {
    list,
    find,
    create,
    update,
    del,
    createReport,
    retrieveReport,
    updateReport,
    delReport,
  };
};
