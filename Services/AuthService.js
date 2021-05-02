// global.fetch = require("node-fetch");

// global.navigator = () => null;
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const request = require("request");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");

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
  const name = body.name;
  const attributeList = [];

  console.log(body)
  attributeList.push(
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "name",
      Value: name,
    })
  );
  userPool.signUp(body.email, body.password, attributeList, null, function (err, result) {
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
      console.log("result------>"+result);
      refreshToken = result.getRefreshToken(); //  getting session toke or can be get from  from calling cognitoUser.getSession()

//     if (AWS.config.credentials.needsRefresh()) {

//   cognitoUser.refreshSession(refreshToken, (err, session) => {
//     if(err) {
//       console.log(err);
//       callback(err);
//     } 
//     else {
//       AWS.config.credentials.params.Logins['cognito-idp.ap-south-1.amazonaws.com/ap-south-1_uckik7u3d']  = session.getIdToken().getJwtToken();
//       AWS.config.credentials.refresh((err,session)=> {
//         if(err)  {
//           console.log(err);
//         }
//         else{
//           console.log("TOKEN SUCCESSFULLY UPDATED",session);
//           callback(null, session);
//         }
//       });
//     }
//   });
// }

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



exports.refreshSession = function ( callback) {
  const cognitorefreshUser = userPool.getCurrentUser();
  if(cognitorefreshUser !== null)
  cognitorefreshUser.getSession(function(err, data) {
  
  if (err) {
    console.log("user session expired",err);
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

}
exports.validate = function(token, callback){
  request({
      url : `https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_uckik7u3d/.well-known/jwks.json`,
      json : true
   }, function(error, response, body){
      if (!error && response.statusCode === 200) {
          pems = {};
          var keys = body['keys'];
          for(var i = 0; i < keys.length; i++) {
               var key_id = keys[i].kid;
               var modulus = keys[i].n;
               var exponent = keys[i].e;
               var key_type = keys[i].kty;
               var jwk = { kty: key_type, n: modulus, e: exponent};
               var pem = jwkToPem(jwk);
               pems[key_id] = pem;
          }
       var decodedJwt = jwt.decode(token, {complete: true});
               if (!decodedJwt) {
                   console.log("Not a valid JWT token");
                   callback(new Error('Not a valid JWT token'));
               }
               var kid = decodedJwt.header.kid;
               var pem = pems[kid];
               if (!pem) {
                   console.log('Invalid token');
                   callback(new Error('Invalid token'));
               }
              jwt.verify(token, pem, function(err, payload) {
                   if(err) {
                       console.log("Invalid Token.");
                       callback(new Error('Invalid token'));
                   } else {
                        console.log("Valid Token.");
                        callback(null, "Valid token");
                   }
              });
      } else {
            console.log("Error! Unable to download JWKs");
            callback(error);
      }
  });
}
