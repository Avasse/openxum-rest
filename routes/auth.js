'use strict';

var jwt = require('jwt-simple');
var bCrypt = require('bcrypt');
var fs = require('fs');

exports = module.exports = function (app) {
  var auth = {
    login: function (req, res) {
      var username = req.body.username || '';
      var password = req.body.password || '';

      if (username == '' || password == '') {
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials, username and/or password empty"
        });
        return;
      }

      // Fire a query to your DB and check if the credentials are valid
      var dbUserObj = auth.validate(username, password, function (err, dbUserObj) {
        if (!dbUserObj) { // If authentication fails, we send a 401 back
          res.status(401);
          res.json({
            "status": 401,
            "message": err
          });
          return;
        }
        if (dbUserObj) {
          // If authentication is success, we will generate a token
          // and dispatch it to the client
          var expires = expiresIn(7); // 7 days

          res.json({
            'token': genToken(dbUserObj, expires),
            'expire': expires,
            'user': dbUserObj
          });
        }
      });
    },
    validate: function (username, password, callback) {
      var getRoleName = function (roles, roleId) {
        var i = 0;

        while (i < roles.length) {
          if (roles[i].dataValues.id === roleId) {
            return roles[i].dataValues.name;
          }
          ++i;
        }
        return "";
      };

      var conditions = {isActive: 'yes'};

      if (username.indexOf('@') === -1) {
        conditions.username = username;
      } else {
        conditions.email = username;
      }

      app.db.models.User.findOne(conditions,
        function (err, user) {
          if (!user) {
            callback("wrong username", null);
          } else if (!user.isActive) {
            callback("User not active", null);
          } else {
            user.validatePassword(password, function (res) {
              if (!res) {
                callback("wrong password", null);
              } else {
                if (user.username === 'root') {
                  user.role = 'admin';
                } else {
                  user.role = 'player';
                }
                callback(null, {
                  username: user.username,
                  id: user.id,
                  role: user.role,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email
                });
              }
            })
          }
        }
      );
    }
  };

// private method
  function genToken(user, expires) {
    var token = jwt.encode({
      exp: expires,
      id: user.id,
      username: user.username,
      roles: user.roles
    }, require('../config/secret')());

    return token;
  }

  function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
  }

  return auth;
};