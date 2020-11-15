var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BusinessSchema = new Schema({
    businessName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        unique: false,
        required: false
    },
    typeOfBusiness: {
        type: String,
    },
    role: {
        type: String,
    },
    option: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true,
      },
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    image : {
        type: String,
    },
    location: {
        type: String,
        require: true
    },
    city : {
        type: String, 
    },
    businessLocation: {
        type: { type: String },
        coordinates: [],
      },
    country : {
        type: String,
    },
    venueId : {
        type: String,
    },
    prefix : {
        type: String,
    },
    suffiex : {
        type: String,
    },
    cityLocation: {
        type: { type: String },
        coordinates: [],
      },
    fullAddress : {
        type: String
    },
    firstName: {
        type: String,
    },
    phone: {
        type: String,
    },
    facebookName: {
        type: String,
    },
    instagram: {
        type: String,
    },
    website: {
        type: String
    },
    hours: {
        type: String
    },
    lastName: {
        type: String,
    },
    workEmail: {
        type: String,
    },
    workPhoneNo: {
        type: Number,
    },
    title: {
        type: String,
    },
    views: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    price: {
        type: String,
    },
    
});
BusinessSchema.index({ businessLocation: '2dsphere' });
BusinessSchema.index({businessName: 'text' });
BusinessSchema.index({fullAddress: 'text'});
BusinessSchema.index({option: 'text' });
BusinessSchema.index({country: 'text' });
BusinessSchema.index({city: 'text' });
module.exports = mongoose.model('Business', BusinessSchema);
