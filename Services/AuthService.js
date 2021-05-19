// global.fetch = require("node-fetch");

// global.navigator = () => null;
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const request = require("request");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");

const poolData = {
  UserPoolId: "us-west-2_97IjCHLA0",
  ClientId: "rjjqpfuu8ue8dmi1cjjrjqb1d",
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
let refreshToken = "";

exports.Register = function (requestBody, callback) {
  console.log("req",typeof requestBody);
  let body;
  if(typeof requestBody === "object"){
    body = requestBody;
  } else{
    body=JSON.parse(requestBody);
  }
  
  const email = body.email;
  const password = body.password;
  const name = body.name;
  const attributeList = [];


  attributeList.push(
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "name",
      Value: name,
    })
  );
  userPool.signUp(email, password, attributeList, null, function (err, result) {
    if (err) callback(err, null);
    else {
      const cognitoUser = result.user;
      console.log("success", cognitoUser);
      callback(null, cognitoUser);
    }
  });
};

exports.Login = function (requestBody, callback) {
  const body = JSON.parse(requestBody);
  console.log("request", body);
  const userName = body.email;
  const password = body.password;
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    {
      Username: userName,
      Password: password,
    }
  );
  const userData = {
    Username: userName,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  console.log("cognitoUser", cognitoUser);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      refreshToken = result.getRefreshToken(); //  getting session toke or can be get from  from calling cognitoUser.getSession()
      const outputJson = {
        accesstoken: result.getAccessToken().getJwtToken()
      };

      callback(null, outputJson);
    },
    onFailure: function (err) {
      console.log("error loggi", err);
      callback(err);
    },
  });
};

exports.refreshSession = function (callback) {
  const cognitorefreshUser = userPool.getCurrentUser();
  if (cognitorefreshUser !== null)
    cognitorefreshUser.getSession(function (err, data) {
      if (err) {
        console.log("user session expired", err);
        callback(err);
        // Prompt the user to reauthenticate by hand...
      } else {
        const cognitoUserSession = data;

        const yourIdToken = cognitoUserSession.getIdToken().jwtToken;
        const yourAccessToken = cognitoUserSession.getAccessToken().jwtToken;
        const outputJson = {
          accesstoken: yourAccessToken,
          IdToken: yourIdToken,
        };
        callback(null, outputJson);
      }
    });
};
exports.validate = function (token, callback) {
 
  request(
    {
      url: `https://cognito-idp.us-west-2.amazonaws.com/us-west-2_97IjCHLA0/.well-known/jwks.json`,
      json: true,
    },
    function (error, response, body) {
      console.log(response,"response");
      console.log(body,"body");
      if (!error && response.statusCode === 200) {
        pems = {};
        const keys = body["keys"];
        for (let i = 0; i < keys.length; i++) {
          const key_id = keys[i].kid;
          const modulus = keys[i].n;
          const exponent = keys[i].e;
          const key_type = keys[i].kty;
          const jwk = { kty: key_type, n: modulus, e: exponent };
          const pem = jwkToPem(jwk);
          pems[key_id] = pem;
        }
        const decodedJwt = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
          console.log("Not a valid JWT token");
          callback("Not a valid JWT token");
        }
        console.log(decodedJwt);
        const kid = decodedJwt.header.kid;
        const pem = pems[kid];
        if (!pem) {
          console.log("Invalid token");
          callback("Invalid token");
        }
        jwt.verify(token, pem, function (err, payload) {
          if (err) {
            console.log("Invalid Token.");
            callback("Invalid token");
          } else {
            console.log("Valid Token.");
            callback(null, "Valid token");
          }
        });
      } else {
        console.log("Error! Unable to download JWKs");
        callback(error);
      }
    }
  );
};
