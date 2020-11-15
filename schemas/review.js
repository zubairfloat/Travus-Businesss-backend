const Joi = require('@hapi/joi');

const reviewSchema = Joi.object().keys({
  date:Joi.string().required(),
  rating: Joi.number().required(),
  suitable: Joi.string().required(),
  welcoming: Joi.string(),
  revisit: Joi.string(),
  comment: Joi.string().allow(""),
  image: Joi.string(),
  userId: Joi.string().required(),
  venueId: Joi.string().required(),
  username: Joi.string().required()
});

module.exports = {
  reviewSchema,
};
