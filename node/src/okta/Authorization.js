const OktaJwtVerifier = require('@okta/jwt-verifier');
var axios = require('axios');
var ErrorResponse = require('../body/response/ErrorResponse');
var log4j = require('../log4j/Log4jHandler');

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oaqic8wsMbUX0U5S356',
  issuer: 'https://dev-903249.okta.com/oauth2/default'
});

var auth = (request) => {
  return new Promise((resolve, reject) => {
    var bearerToken = "";
    if(typeof request == "string") {
      bearerToken = request;
    } else {
      bearerToken = request.header('Authorization');
    }
    if(!bearerToken) {
      reject(ErrorResponse.error("OktaVarifyToken", "No Token"));
    } else {
      if(bearerToken.indexOf("Bearer ") == -1) {
        reject(ErrorResponse.error("OktaVarifyToken", "Token format is wrong"));
      } else {
        const token = bearerToken.split(" ")[1];
        oktaJwtVerifier.verifyAccessToken(token).then((jwt) => {
          resolve(jwt.claims.sub);
        }).catch((err) => {
          log4j.error(err);
          reject(ErrorResponse.error("OktaVarifyToken", err.message));
        })
      }
    }
  })
}

module.exports = {
  auth: auth
}