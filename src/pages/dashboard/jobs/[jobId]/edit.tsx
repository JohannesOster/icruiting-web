import React, {useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {yupResolver} from '@hookform/resolvers';
import {object, array, string, number} from 'yup';
import {API, TJobRequest, TJob} from 'services';
import {
  Box,
  HeadingL,
  H6,
  FlexGrid,
  getDashboardLayout,
  withAdmin,
  Button,
  Input,
  Spinner,
} from 'components';
import {Trash} from 'icons';
import {useTheme} from 'styled-components';
import {useToaster} from 'context';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import {useFetch} from 'components/useFetch';

const OptionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-auto-flow: column;
  column-gap: ${({theme}) => theme.spacing.scale300};
  width: 100%;
  align-items: center;
`;

const EditJob = () => {
  const toaster = useToaster();
  const {spacing} = useTheme();
  const router = useRouter();
  const {jobId} = router.query as {jobId: string};
  const [status, setStatus] = useState('idle');

  const {data: job, error: jobError} = useFetch(
    [`GET /jobs/${jobId}`, jobId],
    (_key: string, jobId) =>
      API.jobs.find(jobId).then((job) => {
        reset(job);
        return job;
      }),
    {revalidateOnFocus: false},
  );

  const {register, errors, control, handleSubmit, formState, reset} =
    useForm<TJobRequest>({
      mode: 'onChange',
      criteriaMode: 'all',
      defaultValues: {...job},
      resolver: yupResolver(
        object().shape({
          jobTitle: string()
            .min(5, 'Stellentitle muss mindestens 5 Zeichen lang sein.')
            .max(50, 'Stellentitle darf maximal 50 Zeichen lang sein.')
            .required('Stellentitel ist verpflichtend.'),
          // for each item add validationrule for the label
          jobRequirements: array().of(
            object().shape({
              requirementLabel: string().required(
                'Item ist verpflichtend auszufüllen oder zu löschen',
              ),
              minValue: number()
                .nullable()
                .transform((value: string, originalValue?: string) => {
                  if (!originalValue) return null;
                  if (typeof originalValue === 'string') {
                    return originalValue?.trim() === '' ? null : value;
                  }

                  return value;
                }),
            }),
          ),
        }),
      ),
    });

  const onSave = (job: TJobRequest) => {
    setStatus('submitting');
    const _job = {...job, jobId} as unknown as TJob;
    API.jobs.update(_job).then(() => {
      toaster.success('Stelle erfolgreich bearbeitet.');
      router.back();
    });
  };

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'jobRequirements',
  });

  return (
    <main>
      <FlexGrid
        flexGap={spacing.scale300}
        justifyContent="space-between"
        marginBottom={spacing.scale300}
      >
        <HeadingL>Stelle bearbeiten</HeadingL>
        <Box display="grid" gridAutoFlow="column" columnGap={spacing.scale500}>
          <Button
            onClick={handleSubmit(onSave)}
            disabled={!formState.isValid}
            isLoading={status === 'submitting'}
          >
            Speichern
          </Button>
          <Button onClick={() => router.back()}>Abbrechen</Button>
        </Box>
      </FlexGrid>
      {!(job || jobError) ? (
        <Spinner />
      ) : (
        <form>
          <Box display="grid" rowGap={spacing.scale300}>
            <Input
              name="jobTitle"
              label="Stellentitel"
              placeholder="Stellentitel"
              ref={register}
              errors={errorsFor(errors, 'jobTitle')}
              required
            />
            <H6 style={{marginBottom: 0}}>Anforderungsprofil*</H6>
            <Box
              display="grid"
              gridRowGap={spacing.scale200}
              alignItems="center"
              marginBottom={spacing.scale400}
            >
              {fields.map((item, idx) => {
                return (
                  <OptionContainer key={item.id}>
                    <Box flex={1}>
                      <Input
                        name={`jobRequirements[${idx}].requirementLabel`}
                        placeholder="Kriterium"
                        defaultValue={item.requirementLabel}
                        ref={register()}
                        errors={errorsFor(
                          errors,
                          `jobRequirements[${idx}].requirementLabel`,
                        )}
                      />
                      <input
                        name={`jobRequirements[${idx}].jobRequirementId`}
                        defaultValue={item.jobRequirementId}
                        ref={register()}
                        hidden
                      />
                    </Box>
                    <Input
                      type="number"
                      placeholder="Mindestmaß (optional)"
                      name={`jobRequirements[${idx}].minValue`}
                      ref={register()}
                      defaultValue={item.minValue}
                      errors={errorsFor(
                        errors,
                        `jobRequirements[${idx}].minValue`,
                      )}
                    />
                    {/* There must be at least 1 item */}
                    {idx > 0 && (
                      <Trash
                        onClick={() => remove(idx)}
                        style={{
                          height: spacing.scale400,
                          width: 'auto',
                          marginLeft: spacing.scale200,
                          cursor: 'pointer',
                        }}
                      />
                    )}
                  </OptionContainer>
                );
              })}
            </Box>
            <Box>
              <Button onClick={() => append({requirementLabel: ''})}>
                Neues Item
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </main>
  );
};

EditJob.getLayout = getDashboardLayout;
export default withAdmin(EditJob);
