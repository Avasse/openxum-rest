'use strict';

exports = module.exports = function (app, mongoose) {
	var gameHistoSchema = new mongoose.Schema({
		name: { type: String, default: '' },
		gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
		game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameType' },
		endtime: { type: Date, default: Date.now },
		score : { type: Number, default: '' },
		status: { type: String, default: 'started'},
		moves: { type: String, default: ''},
		winner : {
 			id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
		},        
		userCreated: {
         id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      },
      opponent: {
         id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', null: true }
      }
    });
    gameHistoSchema.index({ name: 1 });
    gameHistoSchema.index({ game: 1 });
    gameHistoSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('GameHisto', gameHistoSchema);
};