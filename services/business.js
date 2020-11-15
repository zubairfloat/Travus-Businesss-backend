const Business = require('../models/business');

const registerBusiness = (data) => {
    const { image, businessName, userEmail, typeOfBusiness, role, option, location, city, country, businessLocation, cityLocation, userID } = data;
    const business = {
        image,
        businessName,
        userEmail, typeOfBusiness, role, option, location, city, country, userID,
        businessLocation: JSON.parse(businessLocation),
        cityLocation: JSON.parse(cityLocation)
    }
    const businessDetails = new Business({
        ...business
    });
    return businessDetails.save();
}
const registerBusinessApi = (data) => {
    const businessDetails = new Business({
        ...data
    });
    return businessDetails.save();
}
const getBusinessByEmail = (email) => {
    return Business.findOne({ userEmail: email })
}
const getBusinessByUserIdAndType = (userID, typeOfBusiness) => {
    return Business.find({ userID, typeOfBusiness })
}
const getBusinessName = (businessName) => {
    return Business.find({ businessName })
}
// const getAllBusinessType = (typeOfBusiness, pagination, page) => {
//     return Business.find({ typeOfBusiness }).skip((page - 1) * pagination).limit(pagination)
// }
// const getAllBusinessTypeTopRating = (typeOfBusiness, pagination, page) => {
//     return Business.find({ typeOfBusiness }).sort({rating:-1}).skip((page - 1) * pagination).limit(pagination)
// }
const getAllBusinessTypeCity = (city, typeOfBusiness, page, pagination) => {
    return Business.find({ city, $or: [{ typeOfBusiness }] }).skip((page - 1) * pagination).limit(pagination)
}
const getAllBusinessTypeAllCity = (typeOfBusiness, page, pagination) => {
    return Business.find({ typeOfBusiness }).skip((page - 1) * pagination).limit(pagination)
}
const getAllBusinessOnlyCity = (city, page, pagination, ) => {
    return Business.find({ city }).skip((page - 1) * pagination).limit(pagination)
}
const getAllBusinessAllCity = (page, pagination, ) => {
    return Business.find().skip((page - 1) * pagination).limit(pagination)
}
const getAllBusinessTypeCityTopRating = (city, typeOfBusiness, page, pagination) => {
    return Business.find({ city, $or: [{ typeOfBusiness }] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
}
const getAllBusinessTypeALLCityTopRating = (typeOfBusiness, page, pagination) => {
    return Business.find({ typeOfBusiness }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
}
const getAllBusinessOnlyCityTopRating = (city, page, pagination) => {
    return Business.find({ city }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
}
const getAllBusinessAllCityTopRating = (page, pagination) => {
    return Business.find().sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
}
const getAllApiData = (business) => {
    return business.save();
}
const getBusinessById = (_id) => {
    return Business.findOne({ _id });
}
const updateViews = (_id, views) => {
    return Business.updateMany({ _id }, { $set: { views } });
}
const updateRating = (_id, rating) => {
    return Business.updateMany({ _id }, { $set: { rating } });
}
const getBusinessByCityRating = (city, typeOfBusiness, page, pagination) => {
    return Business.find({ city, $or: [{ typeOfBusiness }] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination);
};
const getBusinessByRandomCityRating = (city, page, pagination) => {
    return Business.find({ city }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination);
};
const updateBusiness = (_id, business) => {
    return Business.updateOne({ _id }, business);
}
const getBusinessForName = (city) => {
    return Business.find({ city: { '$regex': new RegExp('^' + city), '$options': 'i' }})
};
const getBusinessClaim = (businessName) => {
    return Business.find({ businessName: { '$regex': businessName, '$options': 'i' }},{})
};
const getBusinessCity = (city, type, businessName, option, page, pagination) => {
    return Business.find({ $and: [{ city: city }, { typeOfBusiness: type }], $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } }] }).skip((page - 1) * pagination).limit(pagination)
};
const getBusinessSearchByAllCity = (type, businessName, option, page, pagination) => {
    return Business.find({ typeOfBusiness: type, $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } }] }).skip((page - 1) * pagination).limit(pagination)
};
const getBusinessRandomCity = (city, businessName, option, page, pagination) => {
    return Business.find({ city: city, $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } }] }).skip((page - 1) * pagination).limit(pagination)
};
const getBusinessAllCity = (businessName, option, page, pagination) => {
    return Business.find({ $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } }] }).skip((page - 1) * pagination).limit(pagination)
};
const getBusinessAllCitTopRating = (businessName, option, page, pagination) => {
    return Business.find({ $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } }] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
};
const getBusinessCityTopRating = (city, type, businessName, option, page, pagination) => {
    return Business.find({ $and: [{ city: city }, { typeOfBusiness: type }], $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } }] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
};
const getBusinessSearchAllCityTopRating = (type, businessName, option, page, pagination) => {
    return Business.find({ typeOfBusiness: type, $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } }] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
};
const getBusinessRandomTopRating = (city, businessName, option, page, pagination) => {
    return Business.find({ city, $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } }] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
};
const getTrendingbusiness = () => {
    return Business.find().sort({ views: -1 }).limit(16)
}
const getNearbusinesstypes = (typeOfBusiness, near, value, page, pagination) => {
    return Business.find({ typeOfBusiness, $or: [{ businessLocation: { $near: { $geometry: { type: "Point", coordinates: near }, $minDistance: 0, $maxDistance: value } } }] }).skip((page - 1) * pagination).limit(pagination)
}
const getNearbusinesstypesSearchTopRating = (type, near, value, businessName, option, page, pagination) => {
    return Business.find({ $and: [{ typeOfBusiness: type }, { businessLocation: { $near: { $geometry: { type: "Point", coordinates: near }, $minDistance: 0, $maxDistance: value } } }], $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } },] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
}
const getNearbusinessAllSearchTopRating = (near, value, businessName, option, page, pagination) => {
    return Business.find({ $and: [{ businessLocation: { $near: { $geometry: { type: "Point", coordinates: near }, $minDistance: 0, $maxDistance: value } } }], $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } },] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
}
const getNearbusinesstypesSearchRandom = (type, near, value, businessName, option, page, pagination) => {
    return Business.find({ $and: [{ typeOfBusiness: type }, { businessLocation: { $near: { $geometry: { type: "Point", coordinates: near }, $minDistance: 0, $maxDistance: value } } }], $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } },] }).skip((page - 1) * pagination).limit(pagination)
}
const getNearbusinessAllSearchRandom = (near, value, businessName, option, page, pagination) => {
    return Business.find({ $and: [{ businessLocation: { $near: { $geometry: { type: "Point", coordinates: near }, $minDistance: 0, $maxDistance: value } } }], $or: [{ businessName: { '$regex': new RegExp('\^' + businessName), '$options': 'i' } }, { option: { '$regex': new RegExp('^' + option), '$options': 'i' } },] }).skip((page - 1) * pagination).limit(pagination)
}
const getNearbusinesstypesTopRating = (typeOfBusiness, near, value, page, pagination) => {
    return Business.find({ typeOfBusiness: typeOfBusiness, $or: [{ businessLocation: { $near: { $geometry: { type: "Point", coordinates: near }, $minDistance: 0, $maxDistance: value } } }] }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
}
const getNearbusinessRandom = (near, value, page, pagination) => {
    return Business.find({ businessLocation: { $near: { $geometry: { type: "Point", coordinates: near }, $minDistance: 0, $maxDistance: value } } }).skip((page - 1) * pagination).limit(pagination)
}
const getNearbusinessRandomTopRating = (near, value, page, pagination) => {
    return Business.find({ businessLocation: { $near: { $geometry: { type: "Point", coordinates: near }, $minDistance: 0, $maxDistance: value } } }).sort({ rating: -1 }).skip((page - 1) * pagination).limit(pagination)
}
const businessService = {
    registerBusiness,
    registerBusinessApi,
    getBusinessByEmail,
    getBusinessByUserIdAndType,
    getAllApiData,
    getBusinessName,
    getBusinessClaim,
    updateBusiness,
    getBusinessById,
    getBusinessForName,
    getBusinessCity,
    updateViews,
    getTrendingbusiness,
    getAllBusinessTypeCity,
    updateRating,
    getAllBusinessTypeCityTopRating,
    getBusinessCityTopRating,
    getBusinessByCityRating,
    getNearbusinesstypes,
    getNearbusinessRandom,
    getAllBusinessOnlyCity,
    getAllBusinessOnlyCityTopRating,
    getBusinessRandomTopRating,
    getBusinessRandomCity,
    getBusinessByRandomCityRating,
    getNearbusinesstypesTopRating,
    getNearbusinessRandomTopRating,
    getNearbusinesstypesSearchTopRating,
    getNearbusinesstypesSearchRandom,
    getAllBusinessAllCityTopRating,
    getAllBusinessAllCity,
    getAllBusinessTypeALLCityTopRating,
    getAllBusinessTypeAllCity,
    getBusinessSearchAllCityTopRating,
    getBusinessSearchByAllCity,
    getNearbusinessAllSearchTopRating,
    getNearbusinessAllSearchRandom,
    getBusinessAllCity,
    getBusinessAllCitTopRating,
}
module.exports = businessService;