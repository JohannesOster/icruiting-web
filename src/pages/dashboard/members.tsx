import React, {useState, useCallback, useEffect} from 'react';
import {
  DataTable,
  H3,
  H6,
  TColumn,
  Flexgrid,
  getDashboardLayout,
  withAdmin,
  Button,
  Select,
  ChipInput,
  Dialog,
} from 'components';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers';
import {errorsFor} from 'utils/react-hook-form-errors-for';
import {email} from 'utils/form-validation';
import {object, array} from 'yup';
import styled, {useTheme} from 'styled-components';
import useSWR from 'swr';
import {API} from 'services';
import {useToaster} from 'context';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TableFooter = styled.footer`
  display: flex;
  margin-top: ${({theme}) => theme.spacing.scale500};
  justify-content: center;
`;

type TMembere = {
  email: string;
  name: string;
  user_role: string;
};

type FormValues = {emails: string[]};

export const Members = () => {
  const {spacing} = useTheme();
  const toaster = useToaster();

  const {data, error} = useSWR('/members', API.members.list);
  const [members, setMembers] = useState<TMembere[] | undefined>();
  const [memberToEdit, setMembereToEdit] = useState<{
    email: string;
    userRole: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNewMembereForm, setShowNewMembereForm] = useState(false);

  const {errors, formState, handleSubmit, reset, control} = useForm<FormValues>(
    {
      mode: 'onChange',
      resolver: yupResolver(
        object({
          emails: array()
            .of(email)
            .required('Email(s) ist ein verpflichtendes Feld.'),
        }),
      ),
      criteriaMode: 'all',
      defaultValues: {emails: []},
    },
  );

  const addMembere = useCallback(
    async ({emails}: {emails: string[]}) => {
      await API.members
        .create(emails)
        .then(() => {
          setShowNewMembereForm(false);
          toaster.success('Mitarbeiter erfolgreich eingeladen.');
          reset();
        })
        .catch((err) => {
          toaster.danger(err.message);
        });
    },
    [reset, toaster],
  );

  useEffect(() => {
    setMembers(data);
  }, [data]);

  const updateMembere = () => {
    if (!memberToEdit) return;

    setIsUpdating(true);
    API.members
      .updateUserRole(memberToEdit.email, memberToEdit.userRole)
      .then(() => {
        setMembers((members) =>
          (members || []).map((member) => {
            if (member.email !== memberToEdit.email) {
              return member;
            }
            return {
              ...member,
              user_role: memberToEdit.userRole,
            };
          }),
        );
        toaster.success('Mitarbeiterrolle erfolgreich gespeichert.');
        setMembereToEdit(null);
        setIsUpdating(false);
      })
      .catch((err) => {
        setMembereToEdit(null);
        setIsUpdating(false);
        toaster.danger(err.message);
      });
  };

  const columns: TColumn[] = [
    {title: 'E-Mail-Adresse', cell: (row) => row.email},
    {
      title: 'Benutzerrolle',
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return (
          <Select
            options={[
              {label: 'Mitarbeiter', value: 'member'},
              {label: 'Administrator', value: 'admin'},
            ]}
            defaultValue={row.user_role}
            onChange={(event) => {
              const {value} = event.target;
              setMembereToEdit({email: row.email, userRole: value});
            }}
          />
        );
      },
    },
    {
      title: 'Speichern',
      // eslint-disable-next-line react/display-name
      cell: (row) => (
        <Button
          onClick={updateMembere}
          disabled={!memberToEdit || memberToEdit.email !== row.email}
          isLoading={isUpdating && memberToEdit?.email === row.email}
        >
          Speichern
        </Button>
      ),
    },
  ];

  return (
    <>
      {showNewMembereForm && (
        <Dialog
          onClose={() => {
            setShowNewMembereForm(false);
          }}
        >
          <H6>Neuen Mitarbeiter Einladen</H6>
          <form
            onSubmit={handleSubmit(addMembere)}
            style={{display: 'grid', gridRowGap: spacing.scale500}}
          >
            <Controller
              name="emails"
              control={control}
              render={(props) => (
                <ChipInput
                  description="Tab klicken um E-Mail-Adresse zu bestätigen"
                  placeholder="E-Mail-Adresse"
                  label="E-Mail-Adresse des neuen Mitarbeiters"
                  errors={
                    errorsFor(errors, 'emails').length
                      ? errorsFor(errors, 'emails')
                      : errorsFor(errors, 'emails[0]')
                  }
                  autoFocus
                  {...props}
                />
              )}
            />

            <Button
              disabled={!(formState.isValid && formState.isDirty)}
              isLoading={formState.isSubmitting}
              type="submit"
            >
              Einladung senden
            </Button>
          </form>
        </Dialog>
      )}
      <main>
        <Flexgrid
          justifyContent="space-between"
          alignItems="center"
          flexGap={spacing.scale200}
          marginBottom={spacing.scale300}
        >
          <H3>Tenant</H3>
          <Button onClick={() => setShowNewMembereForm(true)}>
            Hinzufügen
          </Button>
        </Flexgrid>
        <DataTable
          columns={columns}
          data={members || []}
          isLoading={!(data || error)}
        />
      </main>
    </>
  );
};

Members.getLayout = getDashboardLayout;
export default withAdmin(Members);
