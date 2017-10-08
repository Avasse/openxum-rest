'use strict';

exports = module.exports = function (app) {

  var games = {

    // Create offline game
    createOfflineGame: function (req, res) {
      req.app.db.models.GameType.findOne({name: req.params.gameType}, null,
        {safe: true}, function (err, gametype) {
          req.app.db.models.Game.findOne({name: req.params.name}, null,
            {safe: true}, function (err, game) {
              if (!game) {
                var fieldsToSet = {
                  name: req.params.name,
                  game: gametype._id,
                  color: req.params.color,
                  mode: req.params.mode,
                  type: 'offline',
                  status: 'wait',
                  userCreated: {
                    id: req.user.id,
                    name: req.user.username
                  },
                  opponent: {id: null},
                  currentColor: req.params.color
                };
                req.app.db.models.Game.create(fieldsToSet, function (err, user) {
                  res.status(200).json({});
                });
              }
            });
        });
    },

    // Return offline games
    getOfflineGames: function (req, res) {
      req.app.db.models.Game.find({
          type: 'offline', status: 'run', $or: [
            {'userCreated.id': req.params.idUser},
            {'opponent.id': req.params.idUser}
          ]
        }, null,
        function (err, games) {
          if (games.length > 0) {
            var gamesdetail = [];
            var notdone = true;

            games.forEach(function (game) {
              req.app.db.models.GameType.findOne({_id: game.game}, null,
                {safe: true}, function (err, gameType) {
                  game.type = gameType.name;
                  req.app.db.models.User.findOne({_id: game.userCreated.id}, null,
                    {safe: true}, function (err, userCreated) {
                      game.userCreated.name = userCreated.username;
                      if (game.opponent !== null) {
                        req.app.db.models.User.findOne({_id: game.opponent.id}, null,
                          {safe: true}, function (err, opponent) {
                            var isGameOwner = game.userCreated.id.toString() === req.params.idUser;
                            if (opponent) {
                              game.opponent.name = opponent.username;
                            }
                            if (isGameOwner) {
                              game.myturn = game.currentColor === game.color;
                            } else {
                              game.myturn = game.currentColor !== game.color;
                            }
                            gamesdetail.push(game);
                            if (gamesdetail.length === games.length) {
                              if (notdone) {
                                res.status(200).json({
                                  user_id: req.params.idUser,
                                  my_offline_games: gamesdetail
                                });
                                notdone = false;
                              }
                            }
                          });
                      }
                    });
                });
            });
          } else {
            res.status(200).json({
              user_id: req.params.idUser,
              my_offline_games: []
            });
          }
        });
    },

    // Return all games
    getAllGames: function (req, res) {
      req.app.db.models.GameType.findOne({name: req.params.gameType}, null, {safe: true}, function (err, gameType) {
        req.app.db.models.Game.find({game: gameType._id, type: 'online', 'userCreated.id': req.params.idUser}, null,
          {safe: true}, function (err, games) {
            var my_online_games = games ? games : [];

            req.app.db.models.Game.find({
                game: gameType._id,
                type: 'offline',
                status: 'wait',
                'userCreated.id': req.params.idUser
              }, null,
              {safe: true}, function (err, games) {
                var my_offline_games = games ? games : [];

                req.app.db.models.Game.find({
                    game: gameType._id,
                    type: 'online',
                    'userCreated.id': {'$ne': req.params.idUser}
                  }, 'name color mode userCreated.name',
                  {safe: true}, function (err, games) {
                    var other_online_games = games ? games : [];

                    req.app.db.models.Game.find({
                        game: gameType._id,
                        type: 'offline',
                        status: 'wait',
                        'userCreated.id': {'$ne': req.params.idUser}
                      }, 'name color mode userCreated.name userCreated.id',
                      {safe: true}, function (err, games) {
                        var other_offline_games = games ? games : [];
                        res.status(200).json({
                          game: req.params.gameType,
                          user_id: req.params.idUser,
                          my_online_games: my_online_games,
                          my_offline_games: my_offline_games,
                          other_online_games: other_online_games,
                          other_offline_games: other_offline_games
                        });
                      });
                  });
              });
          });
      });
    }
  };

  return games;
};