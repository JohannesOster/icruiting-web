import {TJob, TJobRequest} from './types';
import API from '../request';

export const Jobs = () => {
  const list = (): Promise<TJob[]> => {
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

  return {list, find, create, update, del};
};
