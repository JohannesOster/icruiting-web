const config = {
  development: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_MeIKYtqcU',
    identityPoolId: 'eu-central-1:e106c55b-c311-40d9-a7dd-bcd5d668ad2a',
    userPoolWebClientId: '3n7mi9c40kr8sp0tuoo6udvfi0',
    endpoint: {name: 'icruiting-api', url: 'http://localhost:5000'},

    loginCallbackUrl: 'http://localhost:3000/login/callback/',
    logoutCallbackUrl: 'http://localhost:3000/logout/',
    userPoolDomain:
      'https://icruiting-web-dev.auth.eu-central-1.amazoncognito.com',
  },
  production: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_WK7ijcvLY',
    identityPoolId: 'eu-central-1:e8a4c58f-7215-4447-bbff-b50a8d7a4842',
    userPoolWebClientId: '6fb5ic9a0vkrb1osaunksajjgn',
    endpoint: {
      name: 'icruiting-api',
      url: 'https://icruiting-api.herokuapp.com',
    },

    loginCallbackUrl: 'https://icruiting.at/login/callback/',
    logoutCallbackUrl: 'https://icruiting.at/logout/',
    userPoolDomain:
      'https://icruiting-web-prod.auth.eu-central-1.amazoncognito.com',
  },
  staging: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_phnHtgeoA',
    identityPoolId: 'eu-central-1:60ebb35a-d0ab-4ab1-a620-ee1820b1522f',
    userPoolWebClientId: '431pn98k14mdn80vgfnb510j2g',
    userPoolDomain:
      'https://icruiting-web-staging.auth.eu-central-1.amazoncognito.com',
    endpoint: {
      name: 'icruiting-api',
      url: 'http://icruiting-staging.eu-central-1.elasticbeanstalk.com/',
    },

    loginCallbackUrl: 'https://staging.icruiting.at/login/callback/',
    logoutCallbackUrl: 'https://staging.icruiting.at/logout/',
  },
};

const env = process.env.NODE_ENV || 'development';
export default config[env];
