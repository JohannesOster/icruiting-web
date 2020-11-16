import React, {FC, useEffect, useRef, useState} from 'react';
import {H3, Flexgrid, Table, Box} from 'components';
import {useTheme} from 'styled-components';
import {Button, Input, useToaster} from 'icruiting-ui';
import {Auth} from 'aws-amplify';
import {useAuth} from 'context';
import config from 'amplify.config';
import {API} from 'services';
import useSWR, {mutate} from 'swr';
import {withAuth} from 'components';
import {getDashboardLayout} from 'components';

export const Theme = () => {
  const {spacing} = useTheme();
  const {currentUser} = useAuth();
  type Status = 'idle' | 'submitting' | 'deleting' | 'fetching';
  const [status, setStatus] = useState<Status>('idle');
  const {danger, success} = useToaster();
  const [files, setFiles] = useState<FileList | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {data: tenant, isValidating} = useSWR(
    [`GET /tenants/${currentUser?.tenantId}`, currentUser?.tenantId],
    (_key, tenantId) => API.tenants.find(tenantId),
  );

  useEffect(() => {
    if (isValidating) setStatus('fetching');
    else setStatus('idle');
  }, [isValidating]);

  const uploadTheme = async () => {
    try {
      setStatus('submitting');

      const formData = new FormData();
      if (!files) throw new Error('Datei fehlt.');
      if (!files.length || !files[0]) return;
      const file = files[0];
      formData.append('theme', file);

      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const request = new XMLHttpRequest();
      request.open(
        'POST',
        `${config.API.endpoints[0].endpoint}/tenants/${currentUser?.tenantId}/themes`,
      );
      request.setRequestHeader('Authorization', `Bearer ${token}`);
      request.onreadystatechange = () => {
        try {
          if (request.readyState === 4) {
            setStatus('idle');
            if (request.status !== 201) throw new Error(request.responseText);
            mutate([
              `GET /tenants/${currentUser?.tenantId}`,
              currentUser?.tenantId,
            ]);
            success('Theme erfolgreich hochgeladen.');
          }
        } catch (error) {
          danger(error.message);
        }
      };

      request.send(formData);
    } catch (error) {
      danger(error.message);
    }
  };

  const deleteTheme = () => {
    setStatus('deleting');
    API.tenants.themes
      .del(currentUser?.tenantId || '')
      .then(() => {
        mutate([
          `GET /tenants/${currentUser?.tenantId}`,
          currentUser?.tenantId,
        ]);
        success('Theme erfolgreich gelöscht');
      })
      .catch((error) => danger(error.message))
      .finally(() => setStatus('idle'));
  };

  return (
    <Box display="grid" rowGap={spacing.scale200}>
      <Flexgrid
        flexGap={spacing.scale200}
        justifyContent="space-between"
        alignItems="center"
      >
        <H3>Theme</H3>
        <a
          href="https://github.com/JohannesOster/icruiting-theme-kit.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          icruiting - Themekit
        </a>
      </Flexgrid>

      <Table>
        <thead>
          <tr>
            <th>Theme</th>
            <th>hochladen</th>
            <th>herunterladen</th>
            <th>löschen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Theme</td>
            <td>
              <form
                ref={formRef}
                onSubmit={async () => {
                  await uploadTheme();
                  formRef.current?.reset();
                }}
                style={{display: 'flex'}}
              >
                <Input
                  type="file"
                  accept=".css"
                  onChange={(event) => {
                    const {files} = event.target;
                    setFiles(files);
                  }}
                />
                <Button
                  kind="minimal"
                  type="submit"
                  isLoading={status === 'submitting'}
                  disabled={!files?.length}
                >
                  hochladen
                </Button>
              </form>
            </td>
            <td>
              {tenant?.theme ? (
                <>
                  <a
                    href={tenant?.theme}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aktuelles Theme
                  </a>
                </>
              ) : (
                '-'
              )}
            </td>
            <td>
              {tenant?.theme ? (
                <Button
                  onClick={() => {
                    deleteTheme();
                  }}
                  isLoading={status === 'deleting'}
                  disabled={status === 'fetching'}
                  kind="minimal"
                >
                  löschen
                </Button>
              ) : (
                '-'
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </Box>
  );
};

Theme.getLayout = getDashboardLayout;
export default withAuth(Theme);
