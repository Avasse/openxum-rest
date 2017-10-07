var jwt = require('jwt-simple');

module.exports = function (req, res, next) {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe.
  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();

  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

  if (token) {
    try {
      var decoded = jwt.decode(token, require('../config/secret.js')());

      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Token Expired"
        });
        return;
      }

      // Authorize the user to see if s/he can access our resources

      if ((req.url.indexOf('admin') >= 0 && decoded.roles[0].roleName == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
        next(); // To move to next middleware
      }
      else {
        res.status(403);
        res.json({
          "status": 403,
          "message": "Not Authorized"
        });
        return;
      }
    } catch (err) {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid Token"
      });
    }
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid Token"
    });
    return;
  }
};