import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useTheme} from 'styled-components';
import {
  HeadingL,
  HeadingS,
  Typography,
  TColumn,
  Box,
  DataTable,
  Table,
  getDashboardLayout,
  FlexGrid,
} from 'components';
import {Button, Dialog, Spinner, Input} from 'components';
import {API, FormCategory, TForm} from 'services';
import {useRouter} from 'next/router';
import {withAdmin} from 'components';
import config from 'config';
import {Edit} from 'icons';
import {useForm} from 'react-hook-form';
import {v4 as uuidv4} from 'uuid';
import {useFetch} from 'components/useFetch';

const JobDetails = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const {jobId} = router.query as {jobId: string};
  const [exporing, setExporting] = useState<string | undefined>();
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const [shouldDeleteFormId, setShouldDeleteFormId] = useState<string | null>(
    null,
  );

  const {data: job, error: jobError} = useFetch(
    [`GET /jobs/${jobId}`, jobId],
    (_key, jobId) => API.jobs.find(jobId),
  );

  const [forms, setForms] = useState<{[key: string]: TForm[]}>({});
  const {
    data,
    error: formsError,
    mutate,
    revalidate,
  } = useFetch([`GET /forms`, jobId], (_key, jobId) => API.forms.list(jobId));

  const [deletingReport, setDeletingReport] = useState(false);
  const {data: report, revalidate: revalidateReport} = useFetch(
    ['GET /jobs/:jobId/report', jobId],
    (_key, jobId) => API.jobs.retrieveReport(jobId),
  );

  const closeReplicaDialog = () => {
    setReplicaToEdit(null);
    setFormToReplicate(null);
    reset({});
  };
  const [replicaToEdit, setReplicaToEdit] = useState<string | null>(null);
  const [formToReplicate, setFormToReplicate] = useState<string | null>(null);
  const {handleSubmit, register, reset} = useForm();

  const onDelete = () => {
    if (!shouldDeleteFormId) return;
    setDeletingFormId(shouldDeleteFormId);
    API.forms.del(shouldDeleteFormId).finally(() => {
      mutate((forms) => forms.filter(({formId}) => formId !== deletingFormId));
      setDeletingFormId(null);
    });
  };

  useEffect(() => {
    if (!data) return;
    const _forms = data.reduce((acc, curr) => {
      const cat = curr.formCategory;
      acc[cat] = acc[cat] ? acc[cat].concat(curr) : [curr];
      return acc;
    }, {} as {[key: string]: TForm[]});
    if (!_forms.onboarding?.length) return setForms(_forms);

    const onboarding = _forms.onboarding.reduce((acc, curr) => {
      if (!curr.replicaOf) {
        acc[curr.formId] = {...acc[curr.formId], ...curr};
        return acc;
      }

      if (!acc[curr.replicaOf]) acc[curr.replicaOf] = {};
      if (!acc[curr.replicaOf]?.replicas) acc[curr.replicaOf].replicas = [];
      acc[curr.replicaOf].replicas = acc[curr.replicaOf].replicas.concat([
        curr,
      ]);

      return acc;
    }, {} as any);

    _forms.onboarding = Object.values(onboarding);
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
          hinzufügen
        </Link>
      );
    }

    return (
      <Box
        display="grid"
        gridColumnGap={spacing.scale200}
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
    {
      title: 'JSON Export',
      cell: ({formId}) => {
        if (!formId) return <>-</>;
        return (
          <Button
            kind="minimal"
            isLoading={exporing === formId}
            onClick={() => {
              setExporting(formId);
              API.forms
                .exportJSON(formId)
                .finally(() => setExporting(undefined));
            }}
          >
            JSON Export
          </Button>
        );
      },
    },
  ];
  const formsTableColumns: TColumn[] = [
    ...baseCols,
    {
      title: 'Direktlink',
      cell: ({formId}) => {
        if (!formId) return <Typography>-</Typography>;
        const domain = config.endpoint.url;
        const iframeSrc = `${domain}/forms/${formId}/html`;
        return (
          <a href={iframeSrc} rel="noopener noreferrer" target="_blank">
            Direktlink
          </a>
        );
      },
    },
  ];

  const formsData = (formCategory: FormCategory) => {
    const form = forms[formCategory];
    return form ? {...form[0]} : {formCategory};
  };
  const applicationFormsData = [formsData('application')];
  const screeningFormsData = [formsData('screening')];

  const onboardingCols: TColumn[] = [
    ...baseCols,
    {
      title: 'Replikate',
      cell: ({replicas}) => (
        <table>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {replicas?.map(({formTitle, formId: replicaFormId}) => (
              <tr key={replicaFormId}>
                <td>{formTitle}</td>
                <td>
                  <Box
                    display="grid"
                    gridColumnGap={spacing.scale200}
                    gridAutoFlow="column"
                    justifyContent="left"
                    alignItems="center"
                  >
                    <Button
                      kind="minimal"
                      onClick={() => {
                        const title = data?.find(
                          ({formId}) => formId === replicaFormId,
                        )?.formTitle;
                        reset({replicaFormTitle: title});
                        setReplicaToEdit(replicaFormId);
                      }}
                    >
                      bearbeiten
                    </Button>
                    <span>/</span>
                    <Button
                      kind="minimal"
                      onClick={() => setShouldDeleteFormId(replicaFormId)}
                    >
                      löschen
                    </Button>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: 'Replikat hinzufügen',
      cell: ({formId}) => (
        <Button kind="minimal" onClick={() => setFormToReplicate(formId)}>
          Replikat hinzufügen
        </Button>
      ),
    },
  ];

  return (
    <main style={{display: 'grid', rowGap: spacing.scale400}}>
      {shouldDeleteFormId && (
        <Dialog
          onClose={() => {
            setShouldDeleteFormId(null);
          }}
        >
          <Box display="grid" rowGap={spacing.scale300}>
            <HeadingS>Formular unwiderruflich löschen?</HeadingS>
            <Typography>
              Sind Sie sicher, dass Sie diese Formular unwiderruflich löschen
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
      {(replicaToEdit || formToReplicate) && (
        <Dialog onClose={closeReplicaDialog}>
          <form
            onSubmit={handleSubmit(async (values) => {
              if (replicaToEdit) {
                const form = ((forms.onboarding || []) as any).reduce(
                  (acc, {replicas}) => {
                    const replica = replicas?.find(
                      ({formId}) => formId === replicaToEdit,
                    );
                    if (!replica) return acc;
                    return replica;
                  },
                  {} as any,
                );
                if (!form) return closeReplicaDialog();
                await API.forms.update({
                  ...form,
                  formTitle: values.replicaFormTitle,
                });
                revalidate();
                closeReplicaDialog();
                return;
              }

              await API.forms.create({
                formId: uuidv4(),
                jobId: job.jobId,
                formTitle: values.replicaFormTitle,
                formCategory: 'onboarding',
                formFields: [],
                replicaOf: formToReplicate,
              });
              revalidate();
              closeReplicaDialog();
            })}
            style={{display: 'grid', rowGap: spacing.scale300}}
          >
            <Input
              label="Formulartitel"
              placeholder="Formulartitel"
              name="replicaFormTitle"
              ref={register}
            />
            <Button type="submit">Speichern</Button>
          </form>
        </Dialog>
      )}
      <HeadingL>{job?.jobTitle}</HeadingL>
      <Box display="grid" gridRowGap={spacing.scale200}>
        <div
          style={{cursor: 'pointer'}}
          onClick={() => router.push(`/dashboard/jobs/${jobId}/edit`)}
        >
          <FlexGrid gap={spacing.scale300} alignItems="center">
            <HeadingS>Anforderungsprofil</HeadingS>
            <Edit />
          </FlexGrid>
        </div>
        {isFetching && <Spinner />}
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
      <Box display="grid" gridRowGap={spacing.scale200}>
        <HeadingS>Evaluierung</HeadingS>
        <Table>
          <thead>
            <tr>
              <th>Formulartyp</th>
              <th>Ranking</th>
              <th>Datenexport</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                formCategory: 'screening',
                title: 'Screening',
                url: `/dashboard/jobs/${jobId}/ranking?formCategory=screening`,
              },
              {
                formCategory: 'assessment',
                title: 'Assessment',
                url: `/dashboard/jobs/${jobId}/ranking?formCategory=assessment`,
              },
              {
                formCategory: 'onboarding',
                title: 'Onboarding',
                url: `/dashboard/jobs/${jobId}/ranking?formCategory=onboarding`,
              },
            ].map(({title, url, formCategory}) => (
              <tr key={url}>
                <td>{title}</td>
                <td>
                  <Link href={url}>Ranking</Link>
                </td>
                <td>
                  <Button
                    kind="minimal"
                    onClick={() => {
                      API.formSubmissions.exportCSV(jobId, formCategory);
                    }}
                  >
                    CSV Export
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
      <Box display="grid" gridRowGap={spacing.scale200}>
        <HeadingS>Gutachen gestalten</HeadingS>
        <Table>
          <thead>
            <tr>
              <th>Gutachten</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gutachten</td>
              <td>
                {!report ? (
                  <Link href={`/dashboard/jobs/${jobId}/reportbuilder`}>
                    hinzufügen
                  </Link>
                ) : (
                  <Box
                    display="grid"
                    gridColumnGap={spacing.scale200}
                    gridAutoFlow="column"
                    justifyContent="left"
                    alignItems="center"
                  >
                    <Link href={`/dashboard/jobs/${jobId}/reportbuilder`}>
                      bearbeiten
                    </Link>
                    <span>/</span>
                    <Button
                      kind="minimal"
                      isLoading={deletingReport}
                      onClick={async () => {
                        setDeletingReport(true);
                        await API.jobs.delReport(jobId);
                        await revalidateReport();
                        setDeletingReport(false);
                      }}
                    >
                      löschen
                    </Button>
                  </Box>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Box>
      <Box display="grid" gridRowGap={spacing.scale200}>
        <HeadingS>Bewerbungs-Formular</HeadingS>
        <DataTable
          columns={formsTableColumns}
          data={applicationFormsData}
          isLoading={isFetching}
        />
      </Box>
      <Box display="grid" gridRowGap={spacing.scale200}>
        <HeadingS>Screening-Formular</HeadingS>
        <DataTable
          columns={baseCols}
          data={screeningFormsData}
          isLoading={isFetching}
        />
      </Box>
      <Box display="grid" gridRowGap={spacing.scale200}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <HeadingS>Assessment-Formulare</HeadingS>
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
          data={forms.assessment || []}
          isLoading={isFetching}
        />
      </Box>
      <Box display="grid" gridRowGap={spacing.scale200}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <HeadingS>Onboarding-Formulare</HeadingS>
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
          columns={onboardingCols}
          data={forms.onboarding || []}
          isLoading={isFetching}
        />
      </Box>
    </main>
  );
};

JobDetails.getLayout = getDashboardLayout;
export default withAdmin(JobDetails);
