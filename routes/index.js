exports = module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  var auth = require('./auth.js')(app);
  var user = require('./../controllers/users.js')(app);

  /*
   * Routes that can be accessed by any one
   */
  router.post('/api/login', auth.login);

  router.get('/api/user/:id/preferences', user.getUserPreferences);
  router.put('/api/user/:id/preferences', user.updateUserPreferences);

  /*
   * Routes that can be accessed only by authenticated users
   */

  return router;
};