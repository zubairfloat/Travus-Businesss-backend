const fs = require('fs');
const reivewSchema = require('../schemas/review').reviewSchema;
const businessService = require('../services/business');
const reviewService = require('../services/review');
const businessController = require('./business.controller');

module.exports.addReview = async (req, res, next) => {

  const data = req.body;
  let venueId = data.venueId
  if (!req.file) {
    console.log("not find")
  }
  else {
    data.image = req.file.filename;
  }
  const valdiate = await reivewSchema.validateAsync(data);
  if (valdiate.error) {
    return res.status(400).json({
      message: validation.error.details[0].message,
    });
  }
  try {
    const review = await reviewService.addReview(data);
    let totalreview = await reviewService.getReviewByBusinessID(venueId)
    let rating = 0
    totalreview.forEach(element => {
      rating += element.rating
    });
    rating = rating / totalreview.length;
    let _id = venueId
    const business = await businessService.getBusinessById(_id);
    if (!business) throw ("business not found")
    let my = await businessService.updateRating(_id, rating)
    if (review) {
      return res.status(200).json({
        succuess: true,
        message: 'review added successfully',
        details: review,
      });
    }
  } catch (error) {
    console.log("error")
  }
};

module.exports.getAllReviews = async (req, res, next) => {
  try {
    let { venueId } = req.body
    let review = await reviewService.getReviewByBusinessID(venueId)
    let rating = 0
    review.forEach(element => {
      rating += element.rating
    });
    rating = rating / review.length;
    res.status(200).json({
      data: review,
      avgRatting: rating
    });
  }
  catch (error) {
    res.status(500).json({
      message: error
    });
  }
}

