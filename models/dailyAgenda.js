const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DailyAgnedaSchema = new Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  agenda: [
    {
        type: mongoose.Schema.Types.ObjectId, ref: "Business",
        time: String,
        location: String 
    },
  ],
}, {timestamps: true} );

module.exports = mongoose.model('DailyAgenda', DailyAgnedaSchema);