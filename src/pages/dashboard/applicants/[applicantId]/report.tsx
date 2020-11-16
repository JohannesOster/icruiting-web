import React, {useEffect, useState} from 'react';
import {API} from 'services';
import useSWR from 'swr';
import {buildRadarChart, parseValue} from 'lib/report-utils';
import {H3, H6, Table, Box, Flexgrid, getDashboardLayout} from 'components';
import {API as AmplifyAPI} from 'aws-amplify';
import {useTheme} from 'styled-components';
import {Arrow} from 'icons';
import {Radar} from 'react-chartjs-2';
import {withAdmin} from 'requireAuth';
import {useRouter} from 'next/router';
import {FormFieldIntent} from 'services';

type KeyValuePair<T> = {[key: string]: T};

type RankingResultVal = {
  label: string;
  intent: FormFieldIntent;
  value: string | string[] | KeyValuePair<string>;
};

type Report = {
  formCategoryScore: string;
  formCategoryResult: any[];
  formCategoryJobRequirementsResult: KeyValuePair<
    KeyValuePair<string | number>
  >;
  result: KeyValuePair<RankingResultVal>;
  jobRequirementsResult: KeyValuePair<string>;
  applicantId: string;
  rank: string;
  score: string;
  formCategoryStddev: string;
  submissionsCount: string;
  submissions: {
    formFieldId: string;
    jobRequirementLabel: string | null;
    value: string;
    intent: FormFieldIntent;
    label: string;
  }[][];
  normalization?: {
    jobRequirementLabel: string;
    mean: string;
    values: string[];
  }[];
};

const ApplicantReport = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const {applicantId, formCategory} = router.query as any;

  const [showApplicant, setShowApplicant] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [showProfile, setShowProfile] = useState(true);

  const {data: applicant} = useSWR(
    ['GET /applicants/:applicantId', applicantId],
    (_key, applicantId) => API.applicants.find(applicantId),
  );

  const [report, setReport] = useState<Report | null>(null);
  useEffect(() => {
    AmplifyAPI.get(
      'icruiting-api',
      `/applicants/${applicantId}/report?formCategory=${formCategory}`,
      {},
    ).then(setReport);
  }, [applicantId, formCategory]);

  const _buildRadarChart = () => {
    if (!(report && report.formCategoryJobRequirementsResult))
      return {data: {}, options: {}};

    return buildRadarChart(report.formCategoryJobRequirementsResult as any);
  };

  const {data = {}, options = {}} = _buildRadarChart();

  return (
    <Box display="grid" rowGap={spacing.scale200}>
      <H3>Gutachten</H3>
      <Box display="grid" rowGap={spacing.scale100}>
        <Flexgrid alignItems="center" flexGap={spacing.scale100}>
          <H6>Bewerber*in - {applicant?.name}</H6>
          <Arrow
            height={spacing.scale300}
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
              {applicant?.attributes.map(({key: attrKey}, idx) => {
                const attribute = applicant?.attributes.find(
                  ({key}) => key === attrKey,
                );
                return (
                  <tr key={idx}>
                    <td>{attribute?.key}</td>
                    <td>{attribute?.value}</td>
                  </tr>
                );
              })}
              {applicant?.files?.map((file, idx) => (
                <tr key={idx}>
                  <td>
                    <a
                      href={file.value}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {file.key}
                    </a>
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Box>

      <Box display="grid" rowGap={spacing.scale100}>
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
            <tr>
              <td>Standardabweichung</td>
              <td>{report?.formCategoryStddev}</td>
            </tr>
          </tbody>
        </Table>
      </Box>
      <Box display="grid" rowGap={spacing.scale100}>
        <Flexgrid alignItems="center" flexGap={spacing.scale100}>
          <H6>Details</H6>
          <Arrow
            height={spacing.scale300}
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
              {report?.formCategoryResult?.map((formResult: any) => (
                <React.Fragment key={formResult.formId}>
                  <tr>
                    <th>
                      {formResult.formTitle ||
                        (formCategory === 'screening'
                          ? 'Screeningformular'
                          : 'Assessment Formular')}
                    </th>
                    <th></th>
                  </tr>
                  {formResult?.formFieldsResult?.map((field: any) => (
                    <tr key={field.formFieldId}>
                      <td>{field.label}</td>
                      <td>
                        {field.intent === 'aggregate' ? (
                          <ul
                            style={{
                              listStylePosition: 'outside',
                              listStyle: 'circle',
                              paddingLeft: '1em',
                            }}
                          >
                            {field.aggregatedValues?.map(
                              (value: any, idx: number) => (
                                <li key={idx}>{value}</li>
                              ),
                            )}
                          </ul>
                        ) : (
                          parseValue(
                            field.formFieldAvg?.toString() ||
                              field.aggregatedValues,
                            field.intent,
                          )
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
      {report?.formCategoryJobRequirementsResult && (
        <Box display="grid" rowGap={spacing.scale100}>
          <Flexgrid alignItems="center" flexGap={spacing.scale100}>
            <H6>Anforderungsprofil</H6>
            <Arrow
              height={spacing.scale300}
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
                  {Object.entries(
                    report?.formCategoryJobRequirementsResult || {},
                  )
                    .sort((a: any, b: any) =>
                      a.requirementLabel > b.requirementLabel ? 1 : -1,
                    )
                    .map(([key, requirementResult]: any) => (
                      <React.Fragment key={key}>
                        <tr>
                          <td>{requirementResult.requirementLabel}</td>
                          <td>{requirementResult.avgJobRequirementScore}</td>
                        </tr>
                      </React.Fragment>
                    ))}
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
export default withAdmin(ApplicantReport);
