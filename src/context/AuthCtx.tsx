import React, {useState, useEffect, useCallback} from 'react';
import {createCtx} from 'icruiting-ui';
import {API, User} from 'services';

interface AuthContext {
  isAuthenticating: boolean;
  currentUser?: User;
  refetchUser: () => void;
  logout: () => void;
}

const [useCtx, CtxProvider] = createCtx<AuthContext>();

const AuthProvider: React.FC = (props) => {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const refetchUser = useCallback(() => {
    return API.auth
      .currentUser()
      .then(setCurrentUser)
      .catch(() => {
        setCurrentUser(null);
      });
  }, []);

  useEffect(() => {
    refetchUser().then(() => setIsAuthenticating(false));
  }, [refetchUser]);

  const logout = async () => {
    await API.auth.logout();
    return refetchUser();
  };

  return (
    <CtxProvider
      value={{isAuthenticating, currentUser, refetchUser, logout}}
      {...props}
    />
  );
};

export {AuthProvider, useCtx as useAuth};
