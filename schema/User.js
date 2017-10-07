'use strict';

exports = module.exports = function (app, mongoose) {
  var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    email: {type: String, unique: true},
    isActive: Boolean,
    timeCreated: {type: Date, default: Date.now}
  });

  userSchema.methods.encryptPassword = function (password, done) {
    var bcrypt = require('bcrypt');
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return done(err);
      }

      bcrypt.hash(password, salt, function (err, hash) {
        done(err, hash);
      });
    });
  };

  userSchema.methods.validatePassword = function (password, done) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        done(false);
      }
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          done(false);
        }
        bcrypt.compare(password, hash, function (err, res) {
          if (err) {
            done(false);
          }
          done(res);
        });
      });
    });
  };

  userSchema.index({ username: 1 }, { unique: true });
  userSchema.index({ email: 1 }, { unique: true });
  userSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('User', userSchema);
};