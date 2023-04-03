import React, {useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {yupResolver} from '@hookform/resolvers';
import {object, array, string, mixed} from 'yup';
import {API, TJobRequest} from 'services';
import {
  Box,
  HeadingL,
  HeadingS,
  FlexGrid,
  getDashboardLayout,
  Button,
  Input,
  withAdmin,
} from 'components';
import {Trash} from 'icons';
import {useTheme} from 'styled-components';
import {useToaster} from 'context';
import {useRouter} from 'next/router';
import styled from 'styled-components';

const OptionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-auto-flow: column;
  column-gap: ${({theme}) => theme.spacing.scale300};
  width: 100%;
  align-items: center;
`;

const CreateJob = () => {
  const toaster = useToaster();
  const {spacing} = useTheme();
  const router = useRouter();
  const [status, setStatus] = useState('idle');

  const onSave = (job: TJobRequest) => {
    setStatus('submitting');
    API.jobs
      .create(job)
      .then(() => {
        toaster.success('Erfolgreich neue Stelle hinzugefügt.');
        router.back();
        setStatus('success');
      })
      .catch((error) => {
        toaster.danger(error.message);
        setStatus('error');
      });
  };

  const {register, errors, control, handleSubmit, formState} =
    useForm<TJobRequest>({
      mode: 'onChange',
      criteriaMode: 'all',
      defaultValues: {jobRequirements: [{requirementLabel: ''}]},
      resolver: yupResolver(
        object({
          jobTitle: string()
            .min(5, 'Stellentitle muss mindestens 5 Zeichen lang sein.')
            .max(50, 'Stellentitle darf maximal 50 Zeichen lang sein.')
            .required('Stellentitel ist verpflichtend.'),
          // for each item add validationrule for the label
          jobRequirements: array().of(
            object({
              requirementLabel: string().required(
                'Item ist verpflichtend auszufüllen oder zu löschen',
              ),
              minValue: mixed()
                .test(
                  'isOptionalNumber',
                  'Mindestmaß muss eine Zahl sein.',
                  (value) => (value ? /^\d*\.?\d*$/.test(value) : true),
                )
                .transform((value) => (value === '' ? undefined : +value)),
            }),
          ),
        }),
      ),
    });

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
        <HeadingL>Neue Stelle</HeadingL>
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
          <HeadingS style={{marginBottom: 0}}>Anforderungsprofil*</HeadingS>
          <Box display="grid" gridRowGap={spacing.scale200} alignItems="center">
            {fields.map((item, idx) => {
              return (
                <OptionContainer key={item.id}>
                  <Input
                    name={`jobRequirements[${idx}].requirementLabel`}
                    placeholder="Kriterium"
                    ref={register()}
                    errors={errorsFor(
                      errors,
                      `jobRequirements[${idx}].requirementLabel`,
                    )}
                  />
                  <Input
                    type="number"
                    placeholder="Mindestmaß (optional)"
                    name={`jobRequirements[${idx}].minValue`}
                    ref={register()}
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
          <div>
            <Button onClick={() => append({requirementLabel: ''})}>
              Neues Item
            </Button>
          </div>
        </Box>
      </form>
    </main>
  );
};

CreateJob.getLayout = getDashboardLayout;
export default withAdmin(CreateJob);
