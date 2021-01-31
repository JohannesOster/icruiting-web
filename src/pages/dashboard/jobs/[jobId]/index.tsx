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

  const {data: job, isValidating: isValidatingJobs} = useSWR(
    [`GET /jobs/${jobId}`, jobId],
    (_key, jobId) => API.jobs.find(jobId),
  );

  const [forms, setForms] = useState<{[key: string]: TForm[]}>({});
  const {data, isValidating: isValidatingForms, mutate} = useSWR(
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

  const isFetching = isValidatingForms || isValidatingJobs;

  const formBuilderURL = `/dashboard/formbuilder/`;
  const actionCell = ({formCategory, formId}: {[key: string]: any}) => {
    if (!formId) {
      return (
        <Link
          href={`${formBuilderURL}?formCategory=${formCategory}&jobId=${jobId}`}
        >
          hinzufügen
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
          bearbeiten
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

  const formsTableColumns: Array<TColumn> = [
    {
      title: 'Kategorie',
      cell: (row) => {
        const cat = row.formCategory as 'application';
        const displayNames = {
          application: 'Bewerbung',
          screening: 'Screening',
          assessment: 'Assessment',
        };
        return displayNames[cat];
      },
    },
    {title: 'Aktion', cell: actionCell},
    {
      title: 'Direktlink',
      cell: ({formCategory, formId}) => {
        if (formCategory !== 'application' || !formId)
          return <Typography>-</Typography>;
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
      cell: ({formCategory, formId}) => {
        if (formCategory !== 'application' || !formId)
          return <Typography>-</Typography>;
        return (
          <Button
            kind="minimal"
            isLoading={exporing}
            onClick={() => {
              setExporting(true);
              API.forms.exportJSON(formId).finally(() => setExporting(false));
            }}
          >
            Als .json exportieren
          </Button>
        );
      },
    },
  ];

  const formsTableData = ['application', 'screening'].map((formCategory) => {
    const form = forms[formCategory];
    return form ? {...form[0]} : {formCategory};
  });

  const assessmentTableColumns: Array<TColumn> = [
    {title: 'Bewertungsformulartitle', cell: (row) => row.formTitle},
    {title: 'Aktion', cell: actionCell},
  ];

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
                  Screeningranking
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                <Link
                  href={`/dashboard/jobs/${jobId}/ranking?formCategory=assessment`}
                >
                  Assessment Center ranking
                </Link>
              </td>
            </tr>
          </tbody>
        </Table>
      </Box>
      <Box display="grid" gridRowGap={spacing.scale100}>
        <H6>Formulare</H6>
        <DataTable
          columns={formsTableColumns}
          data={formsTableData}
          isLoading={isFetching}
        />
      </Box>
      <Box display="grid" gridRowGap={spacing.scale100}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <H6>Assessment - Übungen</H6>
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
          columns={assessmentTableColumns}
          data={forms['assessment'] || []}
          isLoading={isFetching}
        />
      </Box>
    </main>
  );
};

JobDetails.getLayout = getDashboardLayout;
export default withAdmin(JobDetails);
