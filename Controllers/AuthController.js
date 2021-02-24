const authService = require("../Services/AuthService");

exports.register = function (req, res) {
  const register = authService.Register(req.body, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
exports.login = function (req, res) {
  const login = authService.Login(req.body, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
exports.refreshSession = function (req, res) {
  const refreshToken = authService.refreshSession(
    req.body,
    function (err, result) {
      if (err) res.send(err);
      res.send(result);
    }
  );
};
