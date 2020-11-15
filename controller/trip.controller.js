const tripService = require('../services/trip');
const tripSchema = require('../schemas/trip').tripSchema;

module.exports.findBusiness = async (req, res, next) => {
  let data = req.body;
  try {
    const business = await tripService.getBusinessByLatLan(data);
    if (business)
      return res.status(200).json({
        success: true,
        business: business,
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

module.exports.addVenues = async (req, res, next) => {
  try {
    let {userId} = req.body
    const user = await tripService.getUserById(userId);
    if (user) {
      res.status(200).json({
          savedVenues: {
              venues: user.savedVenues ? user.savedVenues : []
          }
      });
  } else {
      res.status(500).json({
          message: "Email doesn't not exists",
      });
  }
  } catch (error) {
  }
};

module.exports.addTrip = async (req, res, next) => {
  // let data = req.body;
  try {
    // const validation = await tripSchema.validateAsync(data);
    // if (validation.error) {
    //   return res.status(400).json({
    //     message: validation.error.details[0].message,
    //   });
    // }
    let {userId, activities, date, location } = req.body;

    const trip = await tripService.saveTrip(userId, date, location)
    if (trip) {
      let agenda = '';
      await Promise.all(activities.map( async activitie => {
        agenda = await tripService.saveAgenda(trip._id, activitie);
      })
      )
      if (agenda) {
        return res.status(201).json({
          success: true,
          message: 'trip added succesfully',
        });
      }
      await tripService.deletTrip(trip._id);
      throw("There were some error ")
    }
    throw(" There were some error ")
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
