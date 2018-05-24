exports = module.exports = function (app) {
  var express = require('express');
  var router = express.Router();
  const { check, validationResult } = require('express-validator/check');

  var auth = require('./auth.js')(app);
  var user = require('./../controllers/users.js')(app);
  var game = require('./../controllers/games.js')(app);

  /*
   * Routes that can be accessed by any one
   */
  router.post('/login', auth.login);

  router.post('/register', [
    check('email').isEmail(),
    check('username').isLength({ min: 3 }),
    check('password').isLength({ min: 4 })
  ], auth.signUp)

  router.get('/api/user/:id/preferences', user.getUserPreferences);
  router.put('/api/user/:id/preferences', user.updateUserPreferences);

  /*
   * Routes that can be accessed only by authenticated users
   */

  router.get('/api/game/offline/:idUser', game.getOfflineGames);
  router.get('/api/game/all/:idUser/:gameType', game.getAllGames);
  router.post('/api/game/create/:gameType/:name/:color/:mode', game.createOfflineGame);

  return router;
};