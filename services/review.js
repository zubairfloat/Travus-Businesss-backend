const Review = require('../models/review');

const addReview = review => {
  const userReview = new Review({
    ...review,
  });

  return userReview.save();
};

const getReviewByBusinessID = (venueId) => {
  return Review.find({venueId })
}
const getReviewByRating = (venueId) => {
  return Review.find({ venueId: { $in:venueId } })
}
module.exports = {
  addReview,
  getReviewByBusinessID,
  getReviewByRating
};