'use strict';

exports = module.exports = function (app, mongoose) {
  require('./schema/Game')(app, mongoose);
  require('./schema/GameHisto')(app, mongoose);
  require('./schema/GameType')(app, mongoose);
  require('./schema/User')(app, mongoose);
};
