import React from 'react';
import {H6} from 'components';
import styled from 'styled-components';

type Props = {
  title: string;
  children?: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const Form = styled.form`
  display: grid;
  grid-row-gap: ${({theme}) => theme.spacing.scale400};
`;

const Container = styled.div`
  width: 80%;
  min-width: 200px;
  max-width: 600px;
  margin: 50px auto;
  display: grid;
  row-gap: ${({theme}) => theme.spacing.scale100};
`;

const AuthForm: React.FC<Props> = ({title, children, onSubmit}) => (
  <Container>
    <H6>{title}</H6>
    <Form onSubmit={onSubmit}>{children}</Form>
  </Container>
);

export {AuthForm};
