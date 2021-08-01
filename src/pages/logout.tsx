import React, {useEffect} from 'react';
import {useAuth} from 'context';

const Logout: React.FC = () => {
  const {logout} = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return <></>;
};

export default Logout;
