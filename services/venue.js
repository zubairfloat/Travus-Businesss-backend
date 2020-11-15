const User = require('../models/user');

const updateVenue = (_id, venues) => {
    return User.updateOne({_id}, {$set : { savedVenues:venues}})
}
const deleteVenue = (_id, venueId) => {
    return User.deleteOne({_id: {savedVenues: venueId}})
}

const userService = {
    updateVenue,
    deleteVenue
}
module.exports = userService;