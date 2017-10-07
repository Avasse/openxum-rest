'use strict';

exports = module.exports = function (app) {

  var games = {

    // Return offline games
    getOfflineGames: function (req, res) {
      req.app.db.models.Game.find({
          type: 'offline', status: 'run', $or: [
            {'userCreated.id': req.idUser},
            {'opponent.id': req.idUser}
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
                            var isGameOwner = game.userCreated.id.toString() === req.idUser;
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
                                  user_id: req.idUser,
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
              user_id: req.idUser,
              my_offline_games: []
            });
          }
        });
    }
  };

  return games;
};