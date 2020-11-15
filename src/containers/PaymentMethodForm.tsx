import React, {FC} from 'react';
import {IbanElement} from '@stripe/react-stripe-js';
import {useAuth} from 'context';
import {Box, Typography} from 'components';
import styled, {useTheme} from 'styled-components';
import {Input, Button} from 'icruiting-ui';
import {useForm} from 'react-hook-form';

const CardContainer = styled.div`
  border: 1px solid;
  border-color: ${({theme}) => theme.colors.inputBorder};
  padding: ${({theme}) => theme.spacing.scale200};
  min-width: 400px;
`;

type Props = {
  onSubmit: (values: any) => void;
};

export const PaymentMethodForm: FC<Props> = ({onSubmit}) => {
  const {currentUser} = useAuth();
  const {spacing} = useTheme();

  const {register, handleSubmit, formState} = useForm({
    defaultValues: {email: currentUser?.email},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="grid" rowGap={spacing.scale200}>
        <Input
          label="E-Mail-Addresse"
          placeholder="E-Mail-Addresse"
          name="email"
          ref={register}
          required
        />
        <Input
          label="Vollständiger Name"
          placeholder="Vollständiger Name"
          name="name"
          ref={register}
          required
        />
        <Box display="grid" rowGap={spacing.scale100}>
          <label>
            <Typography>IBAN*</Typography>
          </label>
          <CardContainer>
            <IbanElement
              options={{supportedCountries: ['SEPA'], placeholderCountry: 'AT'}}
            />
          </CardContainer>
        </Box>
        <Box>
          <Button type="submit" isLoading={formState.isSubmitting}>
            Speichern
          </Button>
        </Box>
      </Box>
    </form>
  );
};
