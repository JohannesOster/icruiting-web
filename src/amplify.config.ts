import {API} from 'services';

const getAuthHeader = async (): Promise<{Authorization?: string}> => {
  return API.auth
    .token()
    .then((token) => ({Authorization: `Bearer ${token}`}))
    .catch(() => ({}));
};

const devConfig = {
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_MeIKYtqcU',
    identityPoolId: 'eu-central-1:e106c55b-c311-40d9-a7dd-bcd5d668ad2a',
    userPoolWebClientId: '3n7mi9c40kr8sp0tuoo6udvfi0',
  },
  API: {
    endpoints: [
      {
        name: 'icruiting-api',
        endpoint: 'http://localhost:5000',
        custom_header: getAuthHeader,
      },
    ],
  },
};

const prodConfig = {
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_WK7ijcvLY',
    identityPoolId: 'eu-central-1:e8a4c58f-7215-4447-bbff-b50a8d7a4842',
    userPoolWebClientId: '6fb5ic9a0vkrb1osaunksajjgn',
  },
  API: {
    endpoints: [
      {
        name: 'icruiting-api',
        endpoint: 'https://icruiting-api.herokuapp.com',
        custom_header: getAuthHeader,
      },
    ],
  },
};

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
