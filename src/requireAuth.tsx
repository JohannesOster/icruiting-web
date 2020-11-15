import {useAuth} from 'context';
import {useRouter} from 'next/router';
import React, {FC} from 'react';

interface Options {
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function withAuth<T>(
  Component: FC,
  {requireAdmin = false, redirectTo = '/login'}: Options = {},
) {
  return (props: T) => {
    const {currentUser, isAuthenticating} = useAuth();
    const router = useRouter();

    if (isAuthenticating) return;
    if (!currentUser) router.replace(redirectTo);
    if (requireAdmin && currentUser.userRole !== 'admin') {
      router.replace(redirectTo);
    }

    return <Component {...props} />;
  };
}

export function withAdmin<T>(Component: FC) {
  return withAuth(Component, {requireAdmin: true, redirectTo: '/'});
}
