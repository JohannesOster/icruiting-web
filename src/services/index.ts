import {Stripe} from './stripe';
import {Tenants} from './tenants';
import {Jobs} from './jobs';
import {Forms} from './forms';
import {FormSubmissions} from './formSubmissions';
import {Applicants} from './applicants';
import {Rankings} from './rankings';

export const API = {
  stripe: Stripe(),
  tenants: Tenants(),
  jobs: Jobs(),
  forms: Forms(),
  formSubmissions: FormSubmissions(),
  applicants: Applicants(),
  rankings: Rankings(),
};

export * from './jobs/types';
export * from './forms/types';
export * from './formSubmissions/types';
export * from './applicants/types';
export * from './rankings/types';
