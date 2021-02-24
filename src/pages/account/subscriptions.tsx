import React, {useState} from 'react';
import {Box, H3, DataTable, TColumn} from 'components';
import {useTheme} from 'styled-components';
import {useAuth} from 'context';
import useSWR, {mutate} from 'swr';
import {API} from 'services';
import {Button, useToaster} from 'icruiting-ui';
import {withAdmin} from 'components';

const Subscriptions: React.FC = () => {
  const {spacing} = useTheme();
  const {currentUser} = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const {danger, success} = useToaster();

  const {data: prices, error: pricesError} = useSWR(
    'GET /stripe/prices',
    API.stripe.prices.list,
  );

  const {data: subscriptions, error: subscriptionsError} = useSWR(
    [
      `GET /tenants/${currentUser?.tenantId}/subscriptions`,
      currentUser?.tenantId,
    ],
    (_key, tenantId) => API.tenants.subscriptions.list(tenantId),
  );

  const displayValForInterval = {month: 'Monat'} as {[key: string]: string};

  const columns: TColumn[] = [
    {title: 'Name', cell: ({product}) => product.name},
    {
      title: 'Preis',
      cell: ({unit_amount, recurring}) => `€ ${unit_amount / 100} /
    ${displayValForInterval[recurring.interval]}`,
    },
    {
      title: 'Status',
      cell: ({id}) => {
        const sub = subscriptions?.find(({plan}) => plan.id === id);
        if (!sub) return '-';
        return sub.status;
      },
    },
    {
      title: 'Aktion',
      cell: ({id}) => {
        const sub = subscriptions?.find(({plan}) => plan.id === id);
        if (!sub)
          return (
            <Button
              kind="minimal"
              onClick={async () => {
                setAddingId(id);
                await API.tenants.subscriptions
                  .create(currentUser?.tenantId || '', id)
                  .then(() => {
                    mutate([
                      `GET /tenants/${currentUser?.tenantId}/subscriptions`,
                      currentUser?.tenantId,
                    ]);
                  })
                  .then(() => success('Subscription erfolgreich ausgewhält.'))
                  .catch((error) => danger(error.message))
                  .finally(() => setDeletingId(null));
              }}
              isLoading={addingId === id}
            >
              auswählen
            </Button>
          );
        return (
          <Button
            kind="minimal"
            onClick={() => {
              setDeletingId(id);
              API.tenants.subscriptions
                .del(currentUser?.tenantId || '', sub.id)
                .then(() => {
                  mutate([
                    `GET /tenants/${currentUser?.tenantId}/subscriptions`,
                    currentUser?.tenantId,
                  ]);
                })
                .then(() => success('Subscription erfolgreich beendet.'))
                .catch((error) => danger(error.message))
                .finally(() => setDeletingId(null));
            }}
            isLoading={deletingId === id}
          >
            beenden
          </Button>
        );
      },
    },
  ];

  return (
    <Box
      margin={`${spacing.scale200} ${spacing.scale400}`}
      display="grid"
      rowGap={spacing.scale400}
    >
      <H3>Subscriptions</H3>
      <DataTable
        columns={columns}
        data={prices || []}
        isLoading={
          !(prices || subscriptions) && !(pricesError || subscriptionsError)
        }
      />
    </Box>
  );
};

export default withAdmin(Subscriptions);
