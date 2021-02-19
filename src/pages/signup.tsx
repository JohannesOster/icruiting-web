import React, {useEffect, useState} from 'react';
import {Box, H6, Typography} from 'components';
import {SignUpForm, SignUpFormValues} from 'containers';
import {useRouter} from 'next/router';
import {useToaster} from 'icruiting-ui';
import spacing from 'theme/spacing';
import {Spinner} from 'icruiting-ui';
import {API} from 'services';
import useSWR from 'swr';

type Status = 'idle' | 'fetching' | 'submitting';
const SignUp: React.FC = () => {
  const router = useRouter();
  const toaster = useToaster();
  const [status, setStatus] = useState<Status>('fetching');
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const {data: prices, error} = useSWR(
    'GET /stripe/prices',
    API.stripe.prices.list,
  );

  useEffect(() => {
    if (!(prices || error)) return;
    setStatus('idle');
  }, [prices]);

  useEffect(() => {
    if (prices?.length) setSelectedPriceId(prices[prices.length - 1].id);
  }, [prices]);

  const onSubmit = async ({tenantName, email, password}: SignUpFormValues) => {
    setStatus('submitting');

    try {
      if (!selectedPriceId) throw new Error('Fehlende Subscriptionsauswahl');

      await API.tenants.create({
        tenantName,
        email,
        password,
        stripePriceId: selectedPriceId,
      });

      toaster.success(
        'Erfolgreich registriert. Bestätigen Sie bitte Ihre E-Mail-Adresse!',
      );

      router.push('/login');
    } catch (err) {
      alert(err.message);
      setStatus('idle');
    }
  };

  const displayValForInterval = {month: 'Monat'} as {[key: string]: string};

  return (
    <Box margin={spacing.scale400} marginTop={spacing.scale600}>
      {status === 'fetching' && !prices?.length && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Spinner />
        </Box>
      )}
      <Box
        display="grid"
        gridAutoFlow="column"
        justifyContent="center"
        columnGap={spacing.scale400}
      >
        {prices?.map((price) => (
          <div key={price.id} onClick={() => setSelectedPriceId(price.id)}>
            <Box
              border={`1px solid ${
                selectedPriceId === price.id ? 'black' : 'lightgray'
              }`}
              cursor="pointer"
              transform={
                selectedPriceId === price.id ? 'scale(1.1)' : 'scale(1)'
              }
              transition="all 0.1s"
              boxShadow={
                selectedPriceId === price.id
                  ? '0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)'
                  : 'none'
              }
            >
              <div style={{borderTop: '5px solid black'}} />
              <Box
                padding={spacing.scale400}
                textAlign="center"
                display="grid"
                rowGap={spacing.scale600}
              >
                <H6>{price.product.name}</H6>
                <Typography
                  kind="secondary"
                  style={{fontSize: spacing.scale400}}
                >
                  € {price.unit_amount / 100} /{' '}
                  {displayValForInterval[price.recurring.interval]}
                </Typography>
                <Box display="grid" rowGap={spacing.scale200}>
                  <Typography
                    kind="secondary"
                    style={{fontSize: spacing.scale400}}
                  >
                    14 Tage Trial
                  </Typography>
                  <Typography
                    kind="secondary"
                    style={{fontSize: spacing.scale200}}
                  >
                    <strong>Keine Zahlungsmethode</strong>
                    <br />
                    notwendig
                  </Typography>
                </Box>
              </Box>
            </Box>
          </div>
        ))}
      </Box>
      {selectedPriceId && (
        <SignUpForm onSubmit={onSubmit} submitting={status === 'submitting'} />
      )}
    </Box>
  );
};

export default SignUp;
