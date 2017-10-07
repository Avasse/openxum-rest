'use strict';

exports = module.exports = function (app, mongoose) {
    var gameTypeSchema = new mongoose.Schema({
        name: { type: String, default: '' }
    });
    gameTypeSchema.index({ name: 1 });
    gameTypeSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('GameType', gameTypeSchema);
};
