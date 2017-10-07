exports = module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  var auth = require('./auth.js')(app);
  var user = require('./../controllers/users.js')(app);
  var game = require('./../controllers/games.js')(app);

  /*
   * Routes that can be accessed by any one
   */
  router.post('/login', auth.login);

  router.get('/api/user/:id/preferences', user.getUserPreferences);
  router.put('/api/user/:id/preferences', user.updateUserPreferences);

  /*
   * Routes that can be accessed only by authenticated users
   */

  router.get('/api/game/offline/:idUser', game.getOfflineGames);

  return router;
};