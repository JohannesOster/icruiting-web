import React, {useState, useCallback, useEffect} from 'react';
import {
  DataTable,
  H3,
  H6,
  TColumn,
  FlexGrid,
  getDashboardLayout,
  withAdmin,
  Button,
  Select,
  ChipInput,
  Dialog,
  Typography,
  Box,
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

type FormValues = {emails: string[]};

export const Members = () => {
  const {spacing} = useTheme();
  const toaster = useToaster();

  const {data: members, error, revalidate} = useSWR(
    '/members',
    API.members.list,
  );
  const [memberToEdit, setMembereToEdit] = useState<{
    email: string;
    userRole: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [deletingMember, setDeletingMember] = useState<string | null>(null);
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

  const updateMember = () => {
    if (!memberToEdit) return;
    setIsEditing(true);
    API.members
      .updateUserRole(memberToEdit.email, memberToEdit.userRole)
      .then(async () => {
        await revalidate();
        toaster.success('Mitarbeiterrolle erfolgreich gespeichert.');
        setMembereToEdit(null);
      })
      .catch((err) => {
        setMembereToEdit(null);
        toaster.danger(err.message);
      })
      .finally(() => setIsEditing(false));
  };

  const delMember = (email: string) => {
    setDeletingMember(email);
    setMemberToDelete(null); // close dialog
    API.members
      .del(email)
      .then(async () => {
        await revalidate();
        toaster.success('Mitarbeiterrolle erfolgreich entfernt.');
      })
      .catch(({message}) => toaster.danger(message))
      .finally(() => setDeletingMember(null));
  };

  const columns: TColumn[] = [
    {title: 'E-Mail-Adresse', cell: (row) => row.email},
    {
      title: 'Benutzerrolle',
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return (
          <>
            <FlexGrid flexGap={spacing.scale300}>
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
              <Button
                onClick={updateMember}
                disabled={
                  !memberToEdit ||
                  memberToEdit.email !== row.email ||
                  row.user_role === memberToEdit.userRole
                }
                isLoading={isEditing && memberToEdit?.email === row.email}
              >
                Speichern
              </Button>
            </FlexGrid>
          </>
        );
      },
    },
    {
      title: 'Status',
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return (
          <>
            {
              {
                CONFIRMED: 'bestätigt',
                FORCE_CHANGE_PASSWORD: 'ausstehend',
                DISABLED: 'unbekannt',
              }[row.status]
            }
          </>
        );
      },
    },
    {
      title: 'Entfernen',
      // eslint-disable-next-line react/display-name
      cell: (row) => (
        <Button
          onClick={() => setMemberToDelete(row.email)}
          disabled={!!deletingMember && deletingMember !== row.email}
          isLoading={deletingMember === row.email}
          kind="minimal"
        >
          entfernen
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
      {memberToDelete && (
        <Dialog onClose={() => setMemberToDelete(null)}>
          <Box display="grid" rowGap={spacing.scale300}>
            <H6>Mitarbeiter*in unwiderruflich entfernen?</H6>
            <Typography>
              Sind Sie sicher dass Sie diesen Mitarbeiter*in entfernen möchten?
              Es werden alle zusammenhängende <b>Daten gelöscht</b>{' '}
              (Bewertungen)? Dieser Vorgang kann nicht rückgängig gemacht
              werden!
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button onClick={() => delMember(memberToDelete)}>Löschen</Button>
              <Button onClick={() => setMemberToDelete(null)}>Abbrechen</Button>
            </Box>
          </Box>
        </Dialog>
      )}
      <main>
        <FlexGrid
          justifyContent="space-between"
          alignItems="center"
          flexGap={spacing.scale200}
          marginBottom={spacing.scale300}
        >
          <H3>Tenant</H3>
          <Button onClick={() => setShowNewMembereForm(true)}>
            Hinzufügen
          </Button>
        </FlexGrid>
        <DataTable
          columns={columns}
          data={members || []}
          isLoading={!(members || error)}
        />
      </main>
    </>
  );
};

Members.getLayout = getDashboardLayout;
export default withAdmin(Members);
