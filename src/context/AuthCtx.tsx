import React, {useState, useEffect, useCallback} from 'react';
import {createCtx} from 'icruiting-ui';
import {Auth} from 'aws-amplify';

type User = {
  email: string;
  givenName: string;
  familyName: string;
  preferredName?: string;
  tenantId: string;
  userRole: string;
  token: string;
};

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

  const fetchCurrentUser = useCallback(async () => {
    try {
      const session = await Auth.currentSession();
      const userInfo = await Auth.currentUserInfo();

      const currUser: User = {
        email: userInfo.attributes.email,
        givenName: userInfo.attributes['given_name'],
        familyName: userInfo.attributes['family_name'],
        preferredName: userInfo.attributes['preferred_username'],
        tenantId: userInfo.attributes['custom:tenant_id'],
        userRole: userInfo.attributes['custom:user_role'],
        token: session.getIdToken().getJwtToken(),
      };
      setCurrentUser(currUser);
    } catch (e) {
      setCurrentUser(undefined);
      if (e !== 'No current user') {
        console.log(e);
      }
    }

    setIsAuthenticating(false);
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const logout = async () => {
    await Auth.signOut();
    fetchCurrentUser();
  };

  return (
    <CtxProvider
      value={{
        isAuthenticating,
        currentUser,
        refetchUser: fetchCurrentUser,
        logout,
      }}
      {...props}
    />
  );
};

export {AuthProvider, useCtx as useAuth};
