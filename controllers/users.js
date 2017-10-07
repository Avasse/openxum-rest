'use strict';

exports = module.exports = function (app) {

  var users = {

    // Return user preferences
    getUserPreferences: function (req, res) {
      /* var idUser = req.params.id;
       app.db.models.User.findOne({
       where: {id: idUser},
       attributes: ['preferences']
       }).then(function (preferences) {
       res.status(200).json(preferences);
       }).catch(function (err) {
       res.status(400).send({
       "status": 400,
       "message": 'User not found'
       });
       }); */

      res.status(200).json({});

    },

    // Update user preferences
    updateUserPreferences: function (req, res) {
      /* var idUser = req.params.id;

       app.db.models.User.update({
       preferences: req.body.preferences
       }, {
       where: {id: idUser},
       attributes: ['preferences'],
       truncate: true
       }).then(function () {
       res.status(200).send(({
       "status": 200,
       "message": 'User update'
       }));

       }).catch(function (err) {
       res.status(400).send({
       "status": 400,
       "message": 'User not update'
       })
       }); */

      res.status(400).send({
        "status": 400,
        "message": 'User not update'
      })

    }

  };

  return users;
};