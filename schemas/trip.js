const Joi = require('@hapi/joi');
const tripSchema = Joi.object().keys({
  schedule: Joi.array()
    .items(
      Joi.object().keys({
        date: Joi.date().required(),
        venueName: Joi.string().required(),
        time: Joi.string().required(),
        businessId: Joi.string().required(),
      }),
    )
    .required(),
  userId: Joi.string().required(),
  from: Joi.date().required(),
  to: Joi.date().required(),
});
module.exports = {
  tripSchema,
};