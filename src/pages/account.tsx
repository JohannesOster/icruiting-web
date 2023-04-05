import React, {useCallback, useState} from 'react';
import Link from 'next/link';
import {useTheme} from 'styled-components';
import {HeadingL, Box, HeadingS, Typography, DialogBody, DialogFooter} from 'components';
import {useAuth, useToaster} from 'context';
import {API} from 'services';
import {Dialog, Button, withAuth} from 'components';

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
      .then(async () => await API.auth.logout())
      .then(() => refetchUser())
      .then(() => success('Tenant erfolgreich gelöscht.'))
      .catch((error) => {
        danger(`Löschen fehlgeschlagen: ${error.message}`);
        setStatus('idle');
      });
  }, [refetchUser, setStatus, danger, success]);

  return (
    <Box
      margin={`${spacing.scale300} ${spacing.scale500}`}
      display="grid"
      rowGap={spacing.scale300}
    >
      {status === 'shouldDelete' && (
        <Dialog onClose={() => setStatus('shouldDelete')} title="Tenant unwiderruflich löschen?">
          <DialogBody>
            Sind Sie sicher dass Sie <b>alle Daten löschen</b> wollen? Dieser Vorgang kann nicht
            rückgängig gemacht werden!
          </DialogBody>
          <DialogFooter>
            <Button kind="secondary" onClick={() => setStatus('idle')}>
              Abbrechen
            </Button>
            <Button onClick={() => _deleteTenant()} destructive>
              Löschen
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      <HeadingL>Account</HeadingL>
      <Box display="flex" gap={spacing.scale400} flexDirection="column">
        <Link href="/password-reset">Passwort zurrücksetzten</Link>
        <Link href="/logout">Abmelden</Link>
        {currentUser?.userRole === 'admin' && (
          <Box>
            <Button
              kind="primary"
              onClick={(event) => {
                event.preventDefault();
                setStatus('shouldDelete');
              }}
              isLoading={status === 'isDeleting'}
              destructive
            >
              Account und Tenant löschen
            </Button>
          </Box>
        )}
      </Box>
      {currentUser?.userRole === 'admin' && (
        <>
          <HeadingL>Zahlungen</HeadingL>
          <Link href="/account/subscriptions">Subscriptions</Link>
          <Link href="/account/payment">Zahlungsmethoden</Link>
        </>
      )}
    </Box>
  );
};

export default withAuth(Account);
