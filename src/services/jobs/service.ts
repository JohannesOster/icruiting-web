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
    return API.post(`/jobs/${jobId}/reports`, {body: {jobId, formFields}});
  };

  const retrieveReport = (jobId: string): Promise<TReport> => {
    return API.get(`/jobs/${jobId}/reports`);
  };

  const delReport = (jobId: string, reportId: string): Promise<null> => {
    return API.del(`/jobs/${jobId}/reports/${reportId}`);
  };

  return {
    list,
    find,
    create,
    update,
    del,
    createReport,
    retrieveReport,
    delReport,
  };
};
