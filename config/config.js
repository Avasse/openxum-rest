'use strict';

exports.port = process.env.PORT || 3000;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/openxum'
};
exports.cryptoKey = 'k3yb0ardc4t';

exports.projectName = 'OpenXum';