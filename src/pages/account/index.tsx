import React, {useCallback, useState} from 'react';
import {Auth} from 'aws-amplify';
import Link from 'next/link';
import {useTheme} from 'styled-components';
import {H3, Box, H6, Typography} from 'components';
import {useAuth} from 'context';
import {API} from 'services';
import {Dialog, Button, useToaster} from 'icruiting-ui';
import {withAuth} from 'components';

const Account: React.FC = () => {
  const {currentUser, refetchUser} = useAuth();
  const {spacing, colors} = useTheme();
  const {success, danger} = useToaster();

  type Status = 'idle' | 'shouldDelete' | 'isDeleting';
  const [status, setStatus] = useState<Status>('idle');

  const _deleteTenant = useCallback(() => {
    setStatus('isDeleting');
    API.tenants
      .del(currentUser.tenantId)
      .then(async () => await Auth.signOut())
      .then(() => refetchUser())
      .then(() => success('Tenant erfolgreich gelöscht.'))
      .catch((error) => {
        danger(`Löschen fehlgeschlagen: ${error.message}`);
        setStatus('idle');
      });
  }, [refetchUser, setStatus, danger, success]);

  return (
    <Box
      margin={`${spacing.scale200} ${spacing.scale400}`}
      display="grid"
      gridRowGap={spacing.scale200}
    >
      {status === 'shouldDelete' && (
        <Dialog onClose={() => setStatus('shouldDelete')}>
          <Box display="grid" rowGap={spacing.scale200}>
            <H6>Tenant unwiederruflich löschen?</H6>
            <Typography>
              Sind Sie sicher dass Sie <b>alle Daten löschen</b> wollen? Dieser
              Vorgang kann nicht rückgängig gemacht werden!
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button onClick={() => _deleteTenant()}>Löschen</Button>
              <Button onClick={() => setStatus('idle')}>Abbrechen</Button>
            </Box>
          </Box>
        </Dialog>
      )}
      <H3>Account</H3>
      <Link href="/password-reset">Passwort zurrücksetzten</Link>
      {currentUser?.userRole === 'admin' && (
        <Box>
          <Button
            kind="minimal"
            onClick={(event) => {
              event.preventDefault();
              setStatus('shouldDelete');
            }}
            isLoading={status === 'isDeleting'}
          >
            <Typography style={{color: colors.typographyPrimaryError}}>
              Account und Tenant unwiderruflich löschen
            </Typography>
          </Button>
        </Box>
      )}
      {currentUser?.userRole === 'admin' && (
        <>
          <H3>Zahlungen</H3>
          <Link href="/account/subscriptions">Subscriptions</Link>
          <Link href="/account/payment">Zahlungsmethoden</Link>
        </>
      )}
    </Box>
  );
};

export default withAuth(Account);
