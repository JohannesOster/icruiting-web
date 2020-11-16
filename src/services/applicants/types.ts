export type Applicant = {
  applicantId: string;
  jobId: string;
  email: string;
  name: string;
  screeningExists: boolean;
  attributes: Array<{key: string; value: string}>;
  files?: Array<{key: string; value: string}>;
  createdAt: string;
};

export type ApplicantAPI = {
  applicant_id: string;
  jobId: string;
  screening_exists: boolean;
  attributes: Array<{key: string; value: string}>;
  files?: Array<{key: string; value: string}>;
  created_at: string;
};

type AssessmentsField = {
  formId: string;
  formCategory: string;
  formTitle?: string;
  score: number;
};

export type AssessmentsAttribute = {
  assessments: AssessmentsField[];
};

export interface ListResponse {
  applicants: (Applicant & AssessmentsAttribute)[];
  totalCount: number;
}
