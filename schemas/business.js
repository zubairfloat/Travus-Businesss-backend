const Joi = require('@hapi/joi');
const businessSchema = Joi.object().keys({
    businessName: Joi.string().required(),
    userEmail: Joi.string(),
    typeOfBusiness: Joi.string(),
    role: Joi.string(),
    option: Joi.string().required(),
    userID: Joi.string(),
    location: Joi.string(),
    businessLocation:Joi.any(),
    cityLocation:Joi.any(),
    image: Joi.any(),
    city: Joi.string(),
    country: Joi.string(),
    views: Joi.number(),
    rating: Joi.number(),
});
const businessUpdateSchema = Joi.object().keys({
    _id: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    workEmail: Joi.string(),
    phone: Joi.number().required(),
    title: Joi.string(),
    price: Joi.string(),

});

module.exports = {
    businessSchema,
    businessUpdateSchema,
  };
  