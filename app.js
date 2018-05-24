var config = require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');

var app = express();

//keep reference to config
app.config = config;

// moment
app.moment = moment;

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  app.db.models.User.findOne({username: "eric62"}, null, {safe: true}, function (err, user) {
    if (!user) {
      var bcrypt = require('bcrypt');

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("toto", salt, function (err, hash) {
          app.db.models.User.create({
            username: "eric62",
            password: hash,
            email: "eric.ramat@gmail.com",
            isActive: true,
            timeCreated: Date.now()
          }, function (err, user) {
            if (!user) {
              console.log(err);
            }
          });
        });
      });
    }
  });
});

//config data models
require('./models')(app, mongoose);

app.all('/*', function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/api/*', [require('./middlewares/validateRequest')]);

app.use('/', require('./routes')(app));

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Start the server
app.set('port', config.port);

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});