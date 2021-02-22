import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useTheme} from 'styled-components';
import {
  H3,
  H6,
  Typography,
  TColumn,
  Box,
  DataTable,
  Table,
  getDashboardLayout,
  Flexgrid,
} from 'components';
import {Button, Dialog, Spinner, Link as ExternalLink} from 'icruiting-ui';
import {API, TForm} from 'services';
import useSWR from 'swr';
import {useRouter} from 'next/router';
import {withAdmin} from 'components';
import amplifyConfig from 'amplify.config';
import {Edit} from 'icons';

const JobDetails = () => {
  const {colors, spacing} = useTheme();
  const router = useRouter();
  const {jobId} = router.query as {jobId: string};
  const [exporing, setExporting] = useState(false);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const [shouldDeleteFormId, setShouldDeleteFormId] = useState<string | null>(
    null,
  );

  const onDelete = () => {
    if (!shouldDeleteFormId) return;
    setDeletingFormId(shouldDeleteFormId);
    API.forms.del(shouldDeleteFormId).finally(() => {
      mutate((forms) => forms.filter(({formId}) => formId !== deletingFormId));
      setDeletingFormId(null);
    });
  };

  const {data: job, error: jobError} = useSWR(
    [`GET /jobs/${jobId}`, jobId],
    (_key, jobId) => API.jobs.find(jobId),
  );

  const [forms, setForms] = useState<{[key: string]: TForm[]}>({});
  const {data, error: formsError, mutate} = useSWR(
    [`GET /forms`, jobId],
    (_key, jobId) => API.forms.list(jobId),
  );

  useEffect(() => {
    if (!data) return;
    const _forms = data.reduce((acc, curr) => {
      const cat = curr.formCategory;
      acc[cat] = acc[cat] ? acc[cat].concat(curr) : [curr];
      return acc;
    }, {} as any);
    setForms(_forms);
  }, [data]);

  const isFetching = !(data || formsError) || !(job || jobError);

  const formBuilderURL = `/dashboard/formbuilder/`;
  const actionCell = ({formCategory, formId}: {[key: string]: any}) => {
    if (!formId) {
      return (
        <Link
          href={`${formBuilderURL}?formCategory=${formCategory}&jobId=${jobId}`}
        >
          <a>hinzufügen</a>
        </Link>
      );
    }

    return (
      <Box
        display="grid"
        gridColumnGap={spacing.scale100}
        gridAutoFlow="column"
        justifyContent="left"
        alignItems="center"
      >
        <Link href={`${formBuilderURL}?formId=${formId}&jobId=${jobId}`}>
          <a>bearbeiten</a>
        </Link>
        <span>/</span>
        <Button
          isLoading={deletingFormId === formId}
          kind="minimal"
          onClick={() => {
            setShouldDeleteFormId(formId);
          }}
        >
          löschen
        </Button>
      </Box>
    );
  };

  const baseCols: TColumn[] = [
    {
      title: 'Formular',
      cell: (row) => {
        const cat = row.formCategory;
        if (row.formTitle) return row.formTitle;
        const displayNames = {application: 'Bewerbung', screening: 'Screening'};
        return displayNames[cat];
      },
    },
    {title: 'Aktion', cell: actionCell},
  ];
  const formsTableColumns: Array<TColumn> = [
    ...baseCols,
    {
      title: 'Direktlink',
      cell: ({formId}) => {
        if (!formId) return <Typography>-</Typography>;
        const domain = amplifyConfig.API.endpoints[0].endpoint;
        const iframeSrc = `${domain}/forms/${formId}/html`;
        return (
          <ExternalLink href={iframeSrc} newTab>
            Direktlink
          </ExternalLink>
        );
      },
    },
    {
      title: 'JSON Export',
      cell: ({formId}) => {
        return (
          <Button
            kind="minimal"
            isLoading={exporing}
            onClick={() => {
              setExporting(true);
              API.forms.exportJSON(formId).finally(() => setExporting(false));
            }}
          >
            JSON Export
          </Button>
        );
      },
    },
  ];

  const applicationFormsData = ['application'].map((formCategory) => {
    const form = forms[formCategory];
    return form ? {...form[0]} : {formCategory};
  });

  const screeningFormsData = ['screening'].map((formCategory) => {
    const form = forms[formCategory];
    return form ? {...form[0]} : {formCategory};
  });

  return (
    <main style={{display: 'grid', rowGap: spacing.scale300}}>
      {shouldDeleteFormId && (
        <Dialog
          onClose={() => {
            setShouldDeleteFormId(null);
          }}
        >
          <Box display="grid" rowGap={spacing.scale200}>
            <H6>Formular unwiederruflich löschen?</H6>
            <Typography>
              Sind Sie sicher, dass Sie diese Formular unwiederruflich löschen
              wollen? Sollte es sich um eine Bewerbungsformular handeln gehen
              sämtlich <b>Attribute aller Bewerber*innen</b> dieser Stelle
              verloren!
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button
                onClick={() => {
                  onDelete();
                  setShouldDeleteFormId(null);
                }}
              >
                Löschen
              </Button>
              <Button
                onClick={() => {
                  setShouldDeleteFormId(null);
                }}
              >
                Abbrechen
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
      <H3>{job?.jobTitle}</H3>
      <Box display="grid" gridRowGap={spacing.scale100}>
        <div
          style={{cursor: 'pointer'}}
          onClick={() => router.push(`/dashboard/jobs/${jobId}/edit`)}
        >
          <Flexgrid gap={spacing.scale200} alignItems="center">
            <H6>Anforderungsprofil</H6>
            <Edit />
          </Flexgrid>
        </div>
        {isFetching && <Spinner color={colors.primary} />}
        {!isFetching && (
          <Table>
            <thead>
              <tr>
                <th>Anforderung</th>
                <th>Mindestmaß</th>
              </tr>
            </thead>
            <tbody>
              {job?.jobRequirements?.map(
                ({requirementLabel, minValue}, idx) => (
                  <tr key={idx}>
                    <td>{requirementLabel}</td>
                    <td>{minValue || 'Keine Angabe'}</td>
                  </tr>
                ),
              )}
            </tbody>
          </Table>
        )}
      </Box>
      <Box display="grid" gridRowGap={spacing.scale100}>
        <H6>Rankings</H6>
        <Table>
          <thead>
            <tr>
              <th>Ranking</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link
                  href={`/dashboard/jobs/${jobId}/ranking?formCategory=screening`}
                >
                  <a>Screeningranking</a>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                <Link
                  href={`/dashboard/jobs/${jobId}/ranking?formCategory=assessment`}
                >
                  <a>Assessment Center ranking</a>
                </Link>
              </td>
            </tr>
          </tbody>
        </Table>
      </Box>
      <Box display="grid" gridRowGap={spacing.scale100}>
        <H6>Bewerbungs-Formular</H6>
        <DataTable
          columns={formsTableColumns}
          data={applicationFormsData}
          isLoading={isFetching}
        />
      </Box>
      <Box display="grid" gridRowGap={spacing.scale100}>
        <H6>Screening-Formular</H6>
        <DataTable
          columns={baseCols}
          data={screeningFormsData}
          isLoading={isFetching}
        />
      </Box>
      <Box display="grid" gridRowGap={spacing.scale100}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <H6>Assessment-Formulare</H6>
          <Button
            onClick={() =>
              router.push(
                `/dashboard/formbuilder?formCategory=assessment&jobId=${jobId}`,
              )
            }
          >
            Hinzufügen
          </Button>
        </Box>
        <DataTable
          columns={baseCols}
          data={forms['assessment'] || []}
          isLoading={isFetching}
        />
      </Box>
      <Box display="grid" gridRowGap={spacing.scale100}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <H6>Onboarding-Formulare</H6>
          <Button
            onClick={() =>
              router.push(
                `/dashboard/formbuilder?formCategory=onboarding&jobId=${jobId}`,
              )
            }
          >
            Hinzufügen
          </Button>
        </Box>
        <DataTable
          columns={baseCols}
          data={forms['onboarding'] || []}
          isLoading={isFetching}
        />
      </Box>
    </main>
  );
};

JobDetails.getLayout = getDashboardLayout;
export default withAdmin(JobDetails);
