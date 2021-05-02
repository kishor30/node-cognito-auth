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
    function (err, result) {
      if (err) res.send(err);
      res.send(result);
    }
  );
};

exports.validate_token = function(req, res){
  console.log(authService);
  let validate = authService.validate(req.body.token,function(err, result){

      if(err)
          res.send(err.message);
      res.send(result);
  })
}
