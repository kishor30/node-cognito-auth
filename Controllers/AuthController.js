const authService = require("../services/AuthService");

exports.register = function (req, res, callback) {
  const register = authService.Register(req.body, function (err, result) {
    if (err) {
      const errorResponse = { statusCode: 400, body: JSON.stringify(err) };
      callback(null, errorResponse);
    }
    const response = { statusCode: 200, body: JSON.stringify(result) };
    callback(null, response);
  });
};

exports.login = function (req, res, callback) {
  const login = authService.Login(req.body, function (err, result) {
    if (result) {
      const response = { statusCode: 200, body: JSON.stringify(result) };
      callback(null, response);
    } else {
      const errorResponse = { statusCode: 400, body: JSON.stringify(err) };
      callback(null, errorResponse);
    }
  });
};

exports.validate = function (req, res, callback) {
  const requestBody = JSON.parse(req.body);
  let validate = authService.validate(requestBody.token, function (err, result) {
    if (result) {
      console.log("result",result);
      const response = { statusCode: 200, body: result };
      callback(null, response);
    } else {
      console.log("error",err)
      const errorResponse = { statusCode: 400, body: err };
      callback(null, errorResponse);
    }
  });
};
