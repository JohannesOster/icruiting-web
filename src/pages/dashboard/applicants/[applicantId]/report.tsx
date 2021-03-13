import React, {useEffect, useState} from 'react';
import {API, TForm} from 'services';
import useSWR from 'swr';
import {buildRadarChart} from 'utils/report-utils';
import {
  H3,
  H6,
  Table,
  Box,
  Flexgrid,
  getDashboardLayout,
  withAuth,
} from 'components';
import {useTheme} from 'styled-components';
import {Arrow} from 'icons';
import {Radar} from 'react-chartjs-2';
import {useRouter} from 'next/router';
import {Button} from 'components';

const ApplicantReport = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const {applicantId, formCategory} = router.query as any;

  const [showApplicant, setShowApplicant] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [showReplicas, setShowReplicas] = useState<string | null>(null);

  const {data: applicant} = useSWR(
    ['GET /applicants/:applicantId', applicantId],
    (_key, applicantId) => API.applicants.find(applicantId),
  );

  const {data: report} = useSWR(
    ['GET /applicant/:applicantId/report', applicantId, formCategory],
    (_key, applicantId, formCategory) =>
      API.applicants.retrieveReport(applicantId, formCategory),
  );

  const [form, setForm] = useState<TForm | undefined>();
  const {data: forms, error: formsError} = useSWR(
    applicant ? [`GET /forms`, applicant.jobId] : null,
    (_key, jobId) => API.forms.list(jobId),
  );

  const {data: reportStructure} = useSWR(
    applicant ? ['GET /jobs/:jobId/report', applicant.jobId] : null,
    (_key, jobId) => API.jobs.retrieveReport(jobId),
  );

  useEffect(() => {
    if (!forms) return;
    const _form = forms.find(
      ({formCategory}) => formCategory === 'application',
    );
    if (!_form) return;
    setForm(_form);
  }, [forms]);

  const _buildRadarChart = () => {
    if (!(report && report.jobRequirementResults))
      return {data: {}, options: {}};

    return buildRadarChart(report.jobRequirementResults as any);
  };

  const {data = {}, options = {}} = _buildRadarChart();

  return (
    <Box display="grid" rowGap={spacing.scale300}>
      <H3>Gutachten</H3>
      <Box display="grid" rowGap={spacing.scale200}>
        <Flexgrid alignItems="center" flexGap={spacing.scale200}>
          <H6>Bewerber*in - {applicant?.name}</H6>
          <Arrow
            height={spacing.scale400}
            onClick={() => setShowApplicant((curr) => !curr)}
            style={{
              transform: `rotate(${showApplicant ? '90deg' : '-90deg'})`,
              cursor: 'pointer',
            }}
          />
        </Flexgrid>
        {showApplicant && (
          <Table>
            <tbody>
              {reportStructure?.formFields.map((fieldId, idx) => {
                const label = form?.formFields.find(
                  ({formFieldId}) => formFieldId === fieldId,
                )?.label;
                const attribute = applicant?.attributes.find(
                  ({key}) => key === label,
                );
                if (attribute) {
                  return (
                    <tr key={idx}>
                      <td>{attribute?.key}</td>
                      <td>{attribute?.value}</td>
                    </tr>
                  );
                }
                const file = applicant?.files.find(({key}) => key === label);
                if (!file)
                  return (
                    <tr key={idx}>
                      <td>{label} nicht vorhanden</td>
                    </tr>
                  );
                return (
                  <tr key={idx}>
                    <td>{file.key}</td>
                    <td>
                      <img style={{maxWidth: '200px'}} src={file.uri} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Box>

      {report?.rank && report?.formCategoryScore && (
        <Box display="grid" rowGap={spacing.scale200}>
          <H6>Übersicht</H6>
          <Table>
            <tbody>
              <tr>
                <td>Rang</td>
                <td>{report?.rank}</td>
              </tr>
              <tr>
                <td>Gesamtscore</td>
                <td>{report?.formCategoryScore}</td>
              </tr>
            </tbody>
          </Table>
        </Box>
      )}
      <Box display="grid" rowGap={spacing.scale200}>
        <Flexgrid alignItems="center" flexGap={spacing.scale200}>
          <H6>Details</H6>
          <Arrow
            height={spacing.scale400}
            onClick={() => setShowDetails((curr) => !curr)}
            style={{
              transform: `rotate(${showDetails ? '90deg' : '-90deg'})`,
              cursor: 'pointer',
            }}
          />
        </Flexgrid>
        {showDetails && (
          <Table>
            <tbody>
              {report?.formResults?.map((formScore) => (
                <React.Fragment key={formScore.formId}>
                  <tr>
                    <th
                      style={{display: 'flex', justifyContent: 'space-between'}}
                    >
                      <span>
                        {formScore.formTitle ||
                          {
                            screening: 'Screening',
                            assessment: 'Assessment',
                            onboarding: 'Onboarding',
                          }[formCategory]}
                      </span>{' '}
                      {formScore.replicas && (
                        <Button
                          kind="minimal"
                          onClick={() => {
                            setShowReplicas((curr) =>
                              curr ? null : formScore.formId,
                            );
                          }}
                        >
                          Replikate anzeigen
                        </Button>
                      )}
                    </th>
                    <th>
                      {formScore.formScore} | σ = {formScore.stdDevFormScore}
                    </th>
                  </tr>
                  {showReplicas === formScore.formId && (
                    <tr>
                      <td>
                        <Table>
                          <tbody>
                            <tr>
                              <td></td>
                              <td></td>
                            </tr>
                            {formScore.replicas?.map((replica) => (
                              <React.Fragment key={replica.formId}>
                                <tr key={replica.formId}>
                                  <th>
                                    {replica.formTitle ||
                                      {
                                        screening: 'Screening',
                                        assessment: 'Assessment',
                                        onboarding: 'Onboarding',
                                      }[formCategory]}
                                  </th>
                                  <th></th>
                                </tr>
                                {replica.formFieldScores.map(
                                  (formFieldScore) => (
                                    <tr key={formFieldScore.formFieldId}>
                                      <td>{formFieldScore.label}</td>
                                      <td>
                                        {formFieldScore.intent ===
                                          'aggregate' && (
                                          <ul
                                            style={{
                                              listStylePosition: 'outside',
                                              listStyle: 'circle',
                                              paddingLeft: '1em',
                                            }}
                                          >
                                            {formFieldScore.aggregatedValues?.map(
                                              (value: any, idx: number) => (
                                                <li key={idx}>{value}</li>
                                              ),
                                            )}
                                          </ul>
                                        )}
                                        {formFieldScore.intent === 'sum_up' &&
                                          formFieldScore.formFieldScore}
                                        {formFieldScore.intent ===
                                          'count_distinct' &&
                                          Object.entries(
                                            formFieldScore.countDistinct,
                                          ).map(([key, value], idx) => (
                                            <li key={idx}>
                                              {key}: {value}
                                            </li>
                                          ))}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </React.Fragment>
                            ))}
                            <tr>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  )}
                  {formScore.formFieldScores.map((formFieldScore) => (
                    <tr key={formFieldScore.formFieldId}>
                      <td>{formFieldScore.label}</td>
                      <td>
                        {formFieldScore.intent === 'aggregate' && (
                          <ul
                            style={{
                              listStylePosition: 'outside',
                              listStyle: 'circle',
                              paddingLeft: '1em',
                            }}
                          >
                            {formFieldScore.aggregatedValues?.map(
                              (value: any, idx: number) => (
                                <li key={idx}>{value}</li>
                              ),
                            )}
                          </ul>
                        )}
                        {formFieldScore.intent === 'sum_up' &&
                          formFieldScore.formFieldScore}
                        {formFieldScore.intent === 'count_distinct' &&
                          Object.entries(formFieldScore.countDistinct).map(
                            ([key, value], idx) => (
                              <li key={idx}>
                                {key}: {value}
                              </li>
                            ),
                          )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </Box>
      {['assessment', 'onboarding'].includes(formCategory) && (
        <Box display="grid" rowGap={spacing.scale200}>
          <Flexgrid alignItems="center" flexGap={spacing.scale200}>
            <H6>Anforderungsprofil</H6>
            <Arrow
              height={spacing.scale400}
              onClick={() => setShowProfile((curr) => !curr)}
              style={{
                transform: `rotate(${showDetails ? '90deg' : '-90deg'})`,
                cursor: 'pointer',
              }}
            />
          </Flexgrid>
          {showProfile && (
            <>
              <Table>
                <tbody>
                  {Object.entries(report?.jobRequirementResults || {}).map(
                    ([key, requirementResult]) => (
                      <React.Fragment key={key}>
                        <tr>
                          <td>{requirementResult.requirementLabel}</td>
                          <td>
                            {Math.round(
                              100 * requirementResult.jobRequirementScore,
                            ) / 100}
                          </td>
                        </tr>
                      </React.Fragment>
                    ),
                  )}
                </tbody>
              </Table>
              <Radar options={options} data={data} />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

ApplicantReport.getLayout = getDashboardLayout;
export default withAuth(ApplicantReport);
