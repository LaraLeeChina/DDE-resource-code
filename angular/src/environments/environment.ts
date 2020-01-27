// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   baseUrl: '',
//   apiBase: 'http://47.56.108.43:5000'
// };


export const environment = {
  production: false,
  baseUrl: '',

  // apiBase: 'http://localhost:8555',
  // oktaUrl: 'https://dev-903249.okta.com',
  // clientId: '0oaqic8wsMbUX0U5S356',
  // redirectUrl: 'http://localhost:4200/implicit/callback',
  // logoutRedirectUri: 'http://localhost:4200/implicit/callback/logout'
  //need configuration
  apiBase: "/api",
  oktaUrl: 'https://dev-login.agilent.com',
  clientId: '0oaoftu65wbL1ESaL0h7',
  redirectUrl: 'https://tools.sbx-11.aws.agilent.com/implicit/callback',
  logoutRedirectUri: 'https://tools.sbx-11.aws.agilent.com/implicit/callback/logout'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
