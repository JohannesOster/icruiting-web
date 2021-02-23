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
    options?: {offset?: number; limit?: number; filter?: string},
  ): Promise<ListResponse> => {
    const {offset, limit, filter} = options || {};
    let query = `?jobId=${jobId}`;
    query += '&orderBy=Vollständiger Name';
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
        totalCount: parseInt(resp.totalCount),
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

  return {list, find, del, retrieveReport};
};
