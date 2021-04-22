import API from '../request';
import {
  Applicant,
  ApplicantAPI,
  AssessmentsAttribute,
  ListResponse,
  Report,
} from './types';
import {convertAPIApplicant} from './convert';

export const Applicants = () => {
  const list = (
    jobId: string,
    options?: {
      offset?: number;
      limit?: number;
      filter?: string;
      orderBy?: string;
    },
  ): Promise<ListResponse> => {
    const {offset, limit, filter, orderBy} = options || {};
    let query = `?jobId=${jobId}`;
    query += `&orderBy=${orderBy || 'Vollständiger Name'}`;
    if (offset !== undefined && limit !== undefined) {
      query += `&offset=${offset}&limit=${limit}`;
    }

    if (filter !== undefined) query += `&filter=${filter}`;

    return API.get<{
      applicants: (ApplicantAPI & AssessmentsAttribute)[];
      totalCount: string;
    }>(`/applicants${query}`).then((resp) => {
      return {
        applicants: resp.applicants.map((applicant) =>
          convertAPIApplicant<Applicant & AssessmentsAttribute>(applicant),
        ),
        totalCount: parseInt(resp.totalCount, 10),
      };
    });
  };

  const find = (applicantId: string): Promise<Applicant> => {
    return API.get(`/applicants/${applicantId}`).then(convertAPIApplicant);
  };

  const del = (applicantId: string): Promise<undefined> => {
    return API.del(`/applicants/${applicantId}`);
  };

  const retrieveReport = (
    applicantId: string,
    formCategory: string,
  ): Promise<Report> => {
    return API.get(
      `/applicants/${applicantId}/report?formCategory=${formCategory}`,
    );
  };

  const confirm = (applicantId: string) => {
    return API.put(`/applicants/${applicantId}/confirm`);
  };

  return {list, find, del, retrieveReport, confirm};
};
