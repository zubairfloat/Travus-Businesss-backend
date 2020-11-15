const userService = require('../services/user');
const { helpers } = require('../helpers');
const userServices = require('../services/user');
const venueServices = require('../services/venue');

module.exports.saveVenue = async (req, res) => {
    try {
        const { userId, venueId } = req.body;
        console.log(userId, venueId);
        
        const user = await userService.getUserById(userId);
        if (!user) {
            throw ("USER is not authenticated!")
        }
        let savedVenues = [];
        if(user.savedVenues) {
            savedVenues = user.savedVenues;
        }
        savedVenues.push(venueId);
        await venueServices.updateVenue(userId, savedVenues);
        const userr = await userService.getUserById(userId);
        res.status(201).json({success: true, message: savedVenues})
    } catch (error) {
        console.log("ERROR IN SAVE : ", error);
        res.status(401).json({success: false, message: error})
    }
}

module.exports.removeVenue = async (req, res) => {
    try {
        const { userId, venueId } = req.body;
        const user = await userService.getUserById(userId);
        if (!user) throw ("USER is not authenticated!")
        // if (!user.savedVenues) throw ("Wrong try!")
        const venue =  user.savedVenues.filter(x => {
           return x != venueId 
        });
        await venueServices.updateVenue(userId, venue);
        const userr = await userService.getUserById(userId);
        res.status(201).json({success: true, message: venue})
    } catch (error) {
        res.status(401).json({success: false, message: error})
    }
}
