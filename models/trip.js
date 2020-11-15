const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  flights: [
    {
      from: String, 
      to: String, 
      departure: String, 
      arrival: String, 
      seatNo: String, 
      bookingRef: String 
    },
  ],
  lodging: {
    checkIn: String,
    checkOut: String,
    Address: String,
    PhoneNo: String,
    bookingRef: String,
  },
  from: String,
  to: String,
  xDays: Number,
  location: {}
}, {timestamps: true} );

module.exports = mongoose.model('Trip', TripSchema);