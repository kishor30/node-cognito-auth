# barndoor-auth-server
This is the authentication server which communicates with cognito with the help of API gateway using serverless as a form of lambda functioins as a API endpoint.

**UserPools**
userpools are basically the ones in cognito which stores users and manage user related activities like CRUD operations and enalbe disable users in cognito.

user pool currently used for barndoor is **barndoor-users** for more details about user pools check on AWS console _services->cognito->Manage userpools->barndoor-users->general-settings_ 

we have 3 APIs as a separate lambdas on AWS console (_services->lambdas->register/login/validate lambda_)

1. Register user
2. Login user
3. Validate token

This is the API Gateway for the barndoor app all communication will be proxied through this API.
[API Gateway](https://3anszvxbwl.execute-api.us-west-2.amazonaws.com/dev/validate "API Gateway path").

1. **Register user** -

This lambda enpoint is used  to create/register users for barndoor app inside cognito's userpools.

To regiser user below is the request body where email and password are mandatory-

```
 {
    "email": "email Id of the user ehich is used as username",
    "password": "password",
    "name":"John doe"
}
```
**where password has a policy as**-

1. min characters 8
2. Require numbers
3. Require special character
4. Require uppercase letters
5. Require lowercase letters

Once the user is created it will return created users entity as a response.
```
{
    "username": "email Id",
    "pool": {
        "userPoolId": "******",
        "clientId": "********",
        "client": {
            "endpoint": "https://cognito-idp.us-west-2.amazonaws.com/",
            "fetchOptions": {}
        },
        "advancedSecurityDataCollectionFlag": true
    },
    "Session": null,
    "client": {
        "endpoint": "https://cognito-idp.us-west-2.amazonaws.com/",
        "fetchOptions": {}
    },
    "signInUserSession": null,
    "authenticationFlowType": "USER_SRP_AUTH",
    "keyPrefix": "CognitoIdentityServiceProvider.rjjqpfuu8ue8dmi1cjjrjqb1d",
    "userDataKey": "CognitoIdentityServiceProvider.rjjqpfuu8ue8dmi1cjjrjqb1d.abc.pqr@gmail.com.userData"
}
```
***
cURL to Register user in Barndoor-

```
curl --location --request POST 'https://3anszvxbwl.execute-api.us-west-2.amazonaws.com/dev/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "email ID",
    "password": "P@55w0rd",
    "name":"John Doe"
}
```
***
_**Once we have registered the user currently we need to manually confirm the user on AWS console services->->cognito->Manage userpools->barndoor-users->user and groups->users tab->created users name->confirm user**_


2. **Login user**-

To login we need valid email Id and Password which returns access token once authenticated.

Payload
```
{
    "email": "Kishor.Gardi@gmail.com",
    "password": "Admin@123"
}
```
cURL to Login-
```
curl --location --request POST 'https://3anszvxbwl.execute-api.us-west-2.amazonaws.com/dev/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "kishor.gardi@gmail.com",
    "password": "Admin@123"
}'
```
_If username or password are incorrect or does not match the policy it returns **NotAuthorizedException.**_

_If they are valid access token is returned._


3. Validate Tokens
 
 This end point is used to validate if the access tokens are correct or not or they are malicious or are expired.

 cURL for validate-

 ```
 curl --location --request POST 'https://3anszvxbwl.execute-api.us-west-2.amazonaws.com/dev/validate' \
--header 'Content-Type: application/json' \
--data-raw '{
    "token": "eyJraWQiOiJiVlpwZnRNT0ZYazB1XC81ZjJnbzB2aWkrT2hMYmptam5LcXdCZE9cL0g4anc9IiwiYWxnIjoiUlMyNTYifQ....."
}'
 ```

 _If the tokens are valid it returns string response valid otherwise invalid_