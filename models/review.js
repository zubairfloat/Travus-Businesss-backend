const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  date: { type: Date },
  rating: { type: Number, required: true },
  suitable: { type: String, required: true },
  welcoming: { type: String },
  revisit: { type: String },
  comment: { type: String },
  image: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  venueId : {type: String},
  username: {type:String}
});

module.exports = mongoose.model('Review', ReviewSchema);