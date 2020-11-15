const Business = require('../models/business');
const Trip = require('../models/trip');
const Agenda = require('../models/dailyAgenda');
const User = require('../models/user');

const getBusinessByLatLan = ({ lat, lng, miles }) => {
  return Business.find({
    businessLocation: {
      $near: {
        $maxDistance: 1000,
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    },
  });
};
const getUserById = (userId) => {
  return User.findOne({ _id: userId }).populate('savedVenues');
}

const addTrip = trip => {
  const addTrip = new Trip({
    ...trip,
  });
  return addTrip.save();
};

const saveTrip = (userId, {from, to, xDays}, location) => {
  const trip = new Trip({
    userId,
    from,
    to,
    xDays,
    location
  });
  return trip.save();
}

const saveAgenda = (tripId, agenda) => {
  const dailyAgenda = new Agenda({
    tripId,
    agenda
  })
  return dailyAgenda.save();
}

const deletTrip = _id => {
  return Trip.deleteOne({ _id })
}

const tripService = {
  getBusinessByLatLan,
  addTrip,
  saveTrip,
  saveAgenda,
  deletTrip,
  getUserById
};

module.exports = tripService;
