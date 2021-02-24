global.fetch = require("node-fetch");

global.navigator = () => null;
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: "ap-south-1_uckik7u3d",
  ClientId: "32g9aidh8n4er2q8o84v24bii5",
};

const pool_region = "ap-south-1";
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
let refreshToken = "";

exports.Register = function (body, callback) {
  const email = body.email;
  const password = body.password;
  const attributeList = [];

  attributeList.push(
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "email",
      Value: email,
    })
  );
  userPool.signUp(email, password, attributeList, null, function (err, result) {
    if (err) callback(err);
    const cognitoUser = result.user;
    callback(null, cognitoUser);
  });
};

exports.Login = function (body, callback) {
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
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      refreshToken = result.getRefreshToken();
      const outputJson = {
        accesstoken: result.getAccessToken().getJwtToken(),
        refreshtoken: result.getRefreshToken().getToken(),
      };

      // const accesstoken = result.getRefreshToken().getToken();
      // console.log(outputJson);
      callback(null, outputJson);
    },
    onFailure: function (err) {
      callback(err);
    },
  });
};
exports.refreshSession = function (body, callback) {
  const userName = body.email;
  const userData = {
    Username: userName,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  console.log(refreshToken);
  cognitoUser.refreshSession(refreshToken, (err, session) => {
    if (err) callback(err);
    callback(null, session);
  });
};
