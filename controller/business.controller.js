const { businessSchema, businessUpdateSchema } = require('../schemas/business');
const businessService = require('../services/business');
const Business = require('../models/business');
const axios = require('axios');
const Config = require('../config/business');
const citiesName = require('../config/cities');
const reviewService = require('../services/review');

module.exports.createBusiness = async (req, res, next) => {
    let data = req.body;
    data.image = req.file.filename
    console.log('got body', JSON.stringify(data, null, 4))
    const validation = businessSchema.validate(data);
    if (validation.error) {
        return res.status(400).json({
            message: validation.error.details[0].message,
        });
    }
    try {
        const getDetail = await businessService.getBusinessByEmail(data.userEmail);
        if (getDetail)
            return res.status(500).json({ message: "You've already Added!" });
        await businessService.registerBusiness(data);
        let workDetails = await businessService.getBusinessByEmail(data.userEmail);
        res.status(201).json({
            success: true,
            message: "Your Business details Updated",
            details: workDetails,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.messzage,
        });
    }
}
module.exports.getBusiness = async (req, res, next) => {
    try {
        let { userID, typeOfBusiness } = req.body
        let business = await businessService.getBusinessByUserIdAndType(userID, typeOfBusiness)
        res.status(200).json({
            data: business
        });
    }
    catch (error) {
        res.status(500).json({
            message: error
        });
    }
}
module.exports.searchBusiness = async (req, res, next) => {
    try {
        let { businessName } = req.body
        let business = await businessService.getBusinessName(businessName)
        res.status(200).json({
            data: business
        });
    }
    catch (error) {
        res.status(500).json({
            message: error
        });
    }
}

module.exports.getAllBusiness = async (req, res, next) => {
    try {
        console.log("mmy ", req.body)
        const pagination = req.body.pagination ? parseInt(req.body.pagination) : 10;
        const page = req.body.page ? parseInt(req.body.page) : 1;
        let near = req.body.name
        let value = req.body.value
        let typeOfBusiness = req.body.typeOfBusiness
        let city = req.body.city
        let rating = req.body.rating
        let distance = req.body.distance
        // let { typeOfBusiness, city, rating, distance, } = req.body
        let business = [];
        console.log("adas")
        if (typeOfBusiness.length === 0) {
            if (distance === true) {
                if (rating === true) {
                    console.log("here 1")
                    business = await businessService.getNearbusinessRandomTopRating(near, value, page, pagination);
                    console.log("data", business)
                }
                else {
                    business = await businessService.getNearbusinessRandom(near, value, page, pagination);
                }
            }
            else {
                if (rating === true) {
                    if (city === "All Cities") {
                        business = await businessService.getAllBusinessAllCityTopRating(page, pagination)
                    }
                    else {
                        business = await businessService.getAllBusinessOnlyCityTopRating(city, page, pagination)
                    }
                }
                else {
                    if (city === "All Cities") {
                        business = await businessService.getAllBusinessAllCity(page, pagination);
                    }
                    else {
                        business = await businessService.getAllBusinessOnlyCity(city, page, pagination);
                    }
                }
            }
        }
        else {
            if (distance === true) {
                if (rating === true) {
                    business = await businessService.getNearbusinesstypesTopRating(typeOfBusiness, near, value, page, pagination);
                }
                else {
                    business = await businessService.getNearbusinesstypes(typeOfBusiness, near, value, page, pagination);
                }
            }
            else {
                if (rating === true) {
                    if (city === "All Cities") {
                        business = await businessService.getAllBusinessTypeALLCityTopRating(typeOfBusiness, page, pagination)
                    }
                    else {
                        business = await businessService.getAllBusinessTypeCityTopRating(city, typeOfBusiness, page, pagination)
                    }
                }
                else {
                    if (city === "All Cities") {
                        business = await businessService.getAllBusinessTypeAllCity(typeOfBusiness, page, pagination)
                    }
                    else {
                        business = await businessService.getAllBusinessTypeCity(city, typeOfBusiness, page, pagination)
                    }

                }
            }
        }
        let id = business.map(data => {
            return data._id
        })
        let venueId = id
        review = await (await reviewService.getReviewByRating(venueId))
        const newData = []
        business.forEach(buisn => {
            const venueId = buisn._id
            const myReviews = review.filter(x => {
                return x.venueId == venueId
            })
            let rating = 0
            myReviews.forEach(element => {
                rating += element.rating
            });
            if (myReviews.length > 0) {
                rating = rating / myReviews.length;
            }
            buisn['rating'] = rating
            let temp2 = {
                businessLocation: buisn.businessLocation,
                rating: rating,
                businessName: buisn.businessName,
                city: buisn.city,
                cityLocation: buisn.cityLocation,
                country: buisn.country,
                facebookName: buisn.facebookName,
                fullAddress: buisn.fullAddress,
                hours: buisn.hours,
                location: buisn.location,
                option: buisn.option,
                phone: buisn.phone,
                prefix: buisn.prefix,
                suffiex: buisn.suffiex,
                typeOfBusiness: buisn.typeOfBusiness,
                venueId: buisn.venueId,
                views: buisn.views,
                website: buisn.website,
                image: buisn.image,
                __v: buisn.__v,
                _id: buisn._id,
            }
            temp2.rating = rating
            newData.push(
                temp2
            )
        })
        res.status(200).json({
            data: newData
        });
    }
    catch (error) {
        res.status(500).json({
            message: error
        });
    }
}

module.exports.getBusinessByCity = async (req, res, next) => {
    const pagination = req.body.pagination ? parseInt(req.body.pagination) : 10;
    const page = req.body.page ? parseInt(req.body.page) : 1;
    let { typeOfBusiness, rating } = req.body
    let city = req.body.cityName
    try {
        let business = [];
        if (typeOfBusiness.length === 0) {
            if (rating === true) {
                if (city === "All Cities") {
                    business = await businessService.getAllBusinessAllCityTopRating(page, pagination);
                }
                else {
                    business = await businessService.getBusinessByRandomCityRating(city, page, pagination);
                }
            }
            else {
                if (city === "All Cities") {
                    business = await businessService.getAllBusinessAllCity(page, pagination);
                }
                else {
                    business = await businessService.getAllBusinessOnlyCity(city, page, pagination);
                }
            }
        }
        else {
            if (rating === true) {
                if (city === "All Cities") {
                    business = await businessService.getAllBusinessTypeALLCityTopRating(typeOfBusiness, page, pagination);
                }
                else {
                    business = await businessService.getBusinessByCityRating(city, typeOfBusiness, page, pagination);
                }
            }
            else {
                if (city === "All Cities") {
                    business = await businessService.getAllBusinessTypeAllCity(typeOfBusiness, page, pagination);
                }
                else {
                    business = await businessService.getAllBusinessTypeCity(city, typeOfBusiness, page, pagination);
                }

            }

        }

        let id = business.map(data => {
            return data._id
        })
        let venueId = id
        review = await (await reviewService.getReviewByRating(venueId))
        const newData = []
        business.forEach(buisn => {
            const venueId = buisn._id
            const myReviews = review.filter(x => {
                return x.venueId == venueId
            })
            let rating = 0
            myReviews.forEach(element => {
                rating += element.rating
            });
            if (myReviews.length > 0) {
                rating = rating / myReviews.length;
            }
            buisn['rating'] = rating
            let temp2 = {
                businessLocation: buisn.businessLocation,
                rating: rating,
                businessName: buisn.businessName,
                city: buisn.city,
                cityLocation: buisn.cityLocation,
                country: buisn.country,
                facebookName: buisn.facebookName,
                fullAddress: buisn.fullAddress,
                hours: buisn.hours,
                location: buisn.location,
                option: buisn.option,
                phone: buisn.phone,
                prefix: buisn.prefix,
                suffiex: buisn.suffiex,
                typeOfBusiness: buisn.typeOfBusiness,
                venueId: buisn.venueId,
                views: buisn.views,
                website: buisn.website,
                image: buisn.image,
                __v: buisn.__v,
                _id: buisn._id,
            }
            temp2.rating = rating
            newData.push(
                temp2
            )
        })
        res.status(200).json({
            businessess: newData
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.getBusinessByName = async (req, res, next) => {
    try {
        let city = req.query.search
        let name = []
        let newName = []
        if (city.length > 2) {
            let nameArray = citiesName.data.filter(el => el.value.toLowerCase().startsWith(city))
            newName = nameArray.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
            name = newName.map(obj => {
                return { label: obj.label }
            })
        }
        else {
        }
        res.status(200).json({
            data: name
        });
    }
    catch (error) {
        console.log('erro is ', error)
        res.status(500).json({
            message: error
        });
    }
};

module.exports.getBusinessClaim = async (req, res, next) => {
    try {
        let businessName = req.query.search
        let business = await businessService.getBusinessClaim(businessName)
        business = business.map(obj => {
            return { id: obj._id, venueId: obj.venueId, label: `${obj.businessName} (${obj.city})`, value: obj.businessName }
        })
        res.status(200).json({
            data: business
        });
    }
    catch (error) {
        console.log('erro is ', error)
        res.status(500).json({
            message: error
        });
    }
};
module.exports.getBusinessVenueName = async (req, res, next) => {
    try {

        let params = JSON.parse(req.query.search)
        console.log("page is ", params)
        const pagination = params.pagination ? parseInt(params.pagination) : 10;
        const page = params.page ? parseInt(params.page) : 1;
        let type = params.typeOfBusiness
        let businessName = params.value
        let value = params.distanceValue
        let near = params.name
        let option = params.value
        let city = params.city
        let rating = params.rating
        let distance = params.distance
        let business = [];
        if (type.length === 0) {
            if (distance === true) {
                if (rating === true) {
                    business = await businessService.getNearbusinessAllSearchTopRating(near, value, businessName, option, page, pagination)
                    business = business.map(obj => {
                        return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, rating: obj.rating, location: obj.location, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                    })
                }
                else {
                    business = await businessService.getNearbusinessAllSearchRandom(near, value, businessName, option, page, pagination)
                    business = business.map(obj => {
                        return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, location: obj.location, rating: obj.rating, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                    })
                }
            }
            else {
                if (rating === true) {
                    if (city === 'All Cities') {
                        business = await businessService.getBusinessAllCitTopRating(businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, rating: obj.rating, location: obj.location, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                        })
                    }
                    else {
                        business = await businessService.getBusinessRandomTopRating(city, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, rating: obj.rating, location: obj.location, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                        })
                    }

                }
                else {
                    if (city === "All Cities") {
                        business = await businessService.getBusinessAllCity(businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, location: obj.location, rating: obj.rating, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                        })
                    }
                    else {
                        business = await businessService.getBusinessRandomCity(city, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, location: obj.location, rating: obj.rating, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                        })
                    }

                }

            }

        }
        else {
            if (distance === true) {
                if (rating === true) {
                    console.log("work")
                    business = await businessService.getNearbusinesstypesSearchTopRating(type, near, value, businessName, option, page, pagination)
                    business = business.map(obj => {
                        return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, rating: obj.rating, location: obj.location, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                    })
                }
                else {
                    business = await businessService.getNearbusinesstypesSearchRandom(type, near, value, businessName, option, page, pagination)
                    business = business.map(obj => {
                        return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, location: obj.location, rating: obj.rating, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                    })
                }
            }
            else {
                if (rating === true) {
                    if (city === "All Cities") {
                        business = await businessService.getBusinessSearchAllCityTopRating(type, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, rating: obj.rating, location: obj.location, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                        })
                    }
                    else {
                        business = await businessService.getBusinessCityTopRating(city, type, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, rating: obj.rating, location: obj.location, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                        })
                    }
                }
                else {
                    if (city === "All Cities") {
                        business = await businessService.getBusinessSearchByAllCity(type, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, location: obj.location, rating: obj.rating, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                        })
                    }
                    else {
                        business = await businessService.getBusinessCity(city, type, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { _id: obj._id, venueId: obj.venueId, value: obj.businessName, option: obj.option, city: obj.city, businessLocation: obj.businessLocation, cityLocation: obj.cityLocation, typeOfBusiness: obj.typeOfBusiness, fullAddress: obj.fullAddress, businessName: obj.businessName, label: obj.businessName, location: obj.location, rating: obj.rating, prefix: obj.prefix, suffiex: obj.suffiex, image: obj.image, phone: obj.phone, website: obj.website, hours: obj.hours, workEmail: obj.workEmail }
                        })
                    }

                }
            }

        }
        let id = business.map(data => {
            return data._id
        })
        let venueId = id
        review = await (await reviewService.getReviewByRating(venueId))
        const newData = []
        business.forEach(buisn => {
            const venueId = buisn._id
            const myReviews = review.filter(x => {
                return x.venueId == venueId
            })
            let rating = 0
            myReviews.forEach(element => {
                rating += element.rating
            });
            if (myReviews.length > 0) {
                rating = rating / myReviews.length;
            }
            buisn['rating'] = rating
            let temp2 = {
                _id: buisn._id,
                businessLocation: buisn.businessLocation,
                rating: rating,
                businessName: buisn.businessName,
                city: buisn.city,
                cityLocation: buisn.cityLocation,
                country: buisn.country,
                facebookName: buisn.facebookName,
                fullAddress: buisn.fullAddress,
                hours: buisn.hours,
                location: buisn.location,
                option: buisn.option,
                phone: buisn.phone,
                prefix: buisn.prefix,
                suffiex: buisn.suffiex,
                typeOfBusiness: buisn.typeOfBusiness,
                venueId: buisn.venueId,
                views: buisn.views,
                website: buisn.website,
                workEmail: buisn.workEmail,
                image: buisn.image,
                __v: buisn.__v,
                _id: buisn._id,
            }
            temp2.rating = rating
            newData.push(
                temp2
            )
        })

        res.status(200).json({
            data: newData
        });
    }
    catch (error) {
        console.log('erro is ', error)
        res.status(500).json({
            message: error
        });
    }
};

module.exports.getBusinessExploreSearch = async (req, res, next) => {
    try {
        let params = JSON.parse(req.query.search)
        console.log("page is ", params)
        const pagination = params.pagination ? parseInt(params.pagination) : 10;
        const page = params.page ? parseInt(params.page) : 1;
        let type = params.typeOfBusiness
        let businessName = params.value
        let value = params.distanceValue
        let near = params.name
        let option = params.value
        let city = params.city
        let rating = params.rating
        let distance = params.distance
        let business = [];
        if (type.length === 0) {
            if (distance === true) {
                if (rating === true) {
                    business = await businessService.getNearbusinessAllSearchTopRating(near, value, businessName, option, page, pagination)
                    business = business.map(obj => {
                        return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                    })
                }
                else {
                    business = await businessService.getNearbusinessAllSearchRandom(near, value, businessName, option, page, pagination)
                    business = business.map(obj => {
                        return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                    })
                }
            }
            else {
                if (rating === true) {
                    if (city === "All Cities") {
                        business = await businessService.getBusinessAllCitTopRating(businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                        })
                    }
                    else {
                        business = await businessService.getBusinessRandomTopRating(city, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                        })
                    }

                }
                else {
                    if (city === "All Cities") {
                        business = await businessService.getBusinessAllCity(businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                        })
                    }
                    else {
                        business = await businessService.getBusinessRandomCity(city, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                        })
                    }
                }

            }

        }
        else {
            if (distance === true) {
                if (rating === true) {
                    console.log("work")
                    business = await businessService.getNearbusinesstypesSearchTopRating(type, near, value, businessName, option, page, pagination)
                    business = business.map(obj => {
                        return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                    })
                }
                else {
                    business = await businessService.getNearbusinesstypesSearchRandom(type, near, value, businessName, option, page, pagination)
                    business = business.map(obj => {
                        return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                    })
                }
            }
            else {
                if (rating === true) {
                    if (city === "All Cities") {
                        business = await businessService.getBusinessSearchAllCityTopRating(type, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                        })
                    }
                    else {
                        business = await businessService.getBusinessCityTopRating(city, type, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                        })
                    }
                }
                else {
                    if (city === "All Cities") {
                        business = await businessService.getBusinessSearchByAllCity(type, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                        })
                    }
                    else {
                        business = await businessService.getBusinessCity(city, type, businessName, option, page, pagination)
                        business = business.map(obj => {
                            return { id: obj._id, venueId: obj.venueId, option: obj.option, fullAddress: obj.fullAddress, businessName: obj.businessName, label: `${obj.businessName} (${obj.option})` }
                        })
                    }
                }
            }
        }
        if (business.length === 0) {
            business = await businessService.getBusinessAllCity(businessName, option, page, pagination)
        }
        res.status(200).json({
            data: business
        });
    }
    catch (error) {
        console.log('erro is ', error)
        res.status(500).json({
            message: error
        });
    }
};


module.exports.getApiDataForSquare = async (req, res, next) => {
    try {
        let data = await axios.get(Config.endPoint + new URLSearchParams(Config.parameters))
        let cityLat = data.data.response.geocode.center.lat
        let cityLng = data.data.response.geocode.center.lng
        let displayAddress = data.data.response.geocode.displayString
        let array = data.data.response.groups[0].items.map(obj => {
            let venue = obj.venue;
            let rest = {
                businessName: venue.name,
                venueId: venue.id,
                location: venue.location.address,
                option: venue.categories[0].name,
                city: "Sydney",
                // city: venue.location.city,
                cityLocation: {
                    type: 'Point',
                    coordinates: [cityLng, cityLat],
                },
                businessLocation: {
                    type: 'Point',
                    coordinates: [venue.location.lng, venue.location.lat],
                },
                country: "Australia",
                // country: venue.location.country,
                fullAddress: displayAddress,
                typeOfBusiness: 'Culture'
            };
            return rest
        });
        let arrayData = array.map(async obj => {
            try {
                let venueId = obj.venueId
                let imageRespose = await axios.get(
                    `${Config.endPointImg}/${venueId}?${new URLSearchParams(Config.parametersImg)}`
                );
                console.log("data ", imageRespose)

                // let phoneContact = imageRespose.data.response.venue.contact.phone
                // let instagramContact = imageRespose.data.response.venue.contact.instagram
                // let facebookNameContact = imageRespose.data.response.venue.contact.facebookName
                // let imgPrefix = imageRespose.data.response.venue.photos.groups[0].items[0].prefix
                // let imgSuffix = imageRespose.data.response.venue.photos.groups[0].items[0].suffix
                // let websiteUrl = imageRespose.data.response.venue.url
                // let hoursVenue = imageRespose.data.response.venue.hours.timeframes[0].open[0].renderedTime
                // obj.prefix = imgPrefix
                // obj.suffiex = imgSuffix
                // obj.phone = phoneContact
                // obj.instagram = instagramContact
                // obj.facebookName = facebookNameContact
                // obj.website = websiteUrl
                // obj.hours = hoursVenue
                // await businessService.registerBusinessApi(obj);
                // console.log("obj ", obj)
            }

            // let arrayData = array.map(async obj => {
            //     try {
            //         let venueId = obj.venueId
            //         let imageRespose = await axios.get(
            //             `${Config.endPointImg}/${venueId}/photos?${new URLSearchParams(Config.parametersImg)}`
            //         );
            //         let imgPrefix = imageRespose.data.response.photos.items[0].prefix
            //         let imgSuffix = imageRespose.data.response.photos.items[0].suffix
            //         obj.prefix = imgPrefix
            //         obj.suffiex = imgSuffix
            //         await businessService.registerBusinessApi(obj);
            //         console.log("obj is ", obj)
            //     }
            catch (e) {
                console.log('error is ', e)
            }
        })

        let imgArray = []
        array.forEach(async obj => {
            imgArray.push(obj)
        })
    }
    catch (error) {
        console.log("error", error)
    }
}

module.exports.getForsquare = async (req, res, next) => {
    try {
        let { cityName, value } = req.body
        console.log("create", req.body)
        const parameters = {
            client_id: '04G2HHOQYNAUBNIKHD2Q0KRO43G40EQQJ0IZWLJXMR1305CW',
            client_secret: 'VMBW33ALU3I2ETGN3WYUPGKIJJMLBE5RSQ5BDECPMXHRLJJS',
            near: cityName,
            section: value,
            v: '20180323',
        };
        let data = await axios.get(Config.endPoint + new URLSearchParams(parameters))
        let cityLat = data.data.response.geocode.center.lat
        let cityLng = data.data.response.geocode.center.lng
        let displayAddress = data.data.response.geocode.displayString
        let array = data.data.response.groups[0].items.map(obj => {
            let venue = obj.venue;
            let rest = {
                businessName: venue.name,
                venueId: venue.id,
                location: venue.location.address,
                option: venue.categories[0].name,
                city: venue.location.city,
                cityLocation: {
                    type: 'Point',
                    coordinates: [cityLng, cityLat],
                },
                businessLocation: {
                    type: 'Point',
                    coordinates: [venue.location.lng, venue.location.lat],
                },
                country: venue.location.country,
                fullAddress: displayAddress,
                typeOfBusiness: 'Food'
            };
            return rest
        });
        let arrayData = array.map(async obj => {
            try {
                let venueId = obj.venueId
                let imageRespose = await axios.get(
                    `${Config.endPointImg}/${venueId}?${new URLSearchParams(Config.parametersImg)}`
                );
                let phoneContact = imageRespose.data.response.venue.contact.phone
                let instagramContact = imageRespose.data.response.venue.contact.instagram
                let facebookNameContact = imageRespose.data.response.venue.contact.facebookName
                let imgPrefix = imageRespose.data.response.venue.photos.groups[0].items[0].prefix
                let imgSuffix = imageRespose.data.response.venue.photos.groups[0].items[0].suffix
                let websiteUrl = imageRespose.data.response.venue.url
                let hoursVenue = imageRespose.data.response.venue.hours.timeframes[0].open[0].renderedTime
                obj.prefix = imgPrefix
                obj.suffiex = imgSuffix
                obj.phone = phoneContact
                obj.instagram = instagramContact
                obj.facebookName = facebookNameContact
                obj.website = websiteUrl
                obj.hours = hoursVenue
                await businessService.registerBusinessApi(obj);
            }

            catch (e) {
                console.log('error is ', e)
            }
        })
        console.log("to call api ")
    }
    catch (error) {
        console.log("error", error)
    }
};

module.exports.businessUpdate = async (req, res, next) => {
    const validation = businessUpdateSchema.validate(req.body);
    if (validation.error) {
        return res.status(400).json({
            message: validation.error.details[0].message,
        });
    }
    try {
        const { _id } = req.body;
        const update = await businessService.getBusinessById(_id);
        if (update) {
            try {
                let business = {
                    $set: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        workEmail: req.body.workEmail,
                        phone: req.body.phone,
                        title: req.body.title,
                        price: req.body.price,
                    }
                };
                const updatedBusiness = await businessService.updateBusiness(_id, business);
                if (updatedBusiness)
                    res.status(200).json({
                        data: {
                            business: {
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                workEmail: req.body.workEmail,
                                phone: req.body.phone,
                                title: req.body.title,
                                price: req.body.price,
                            },
                        },

                    });
                else {
                    res.status(400).json({ message: "Try again" });
                }
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
        }
        else {
            res.status(500).json({
                message: "Business doesn't not exists",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }

}
module.exports.updateBusinessViews = async (req, res) => {
    try {
        let _id = req.query._id;
        const business = await businessService.getBusinessById(_id);
        if (!business) throw ("business not found")
        const views = business.views ? business.views + 1 : 1
        await businessService.updateViews(_id, views)
        res.status(200).json({
            message: "Updated views",
            data: business
        })
    }
    catch (error) {
        console.log("errror is ", error)
        res.status(500).json({
            message: error
        });
    }
}

module.exports.trendingBusiness = async (req, res) => {
    try {
        const business = await businessService.getTrendingbusiness();
        res.status(200).json({
            message: "Get Top Trendings ",
            data: business
        })
    }
    catch (error) {
        res.status(500).json({
            message: error
        });
    }
}
module.exports.nearBusiness = async (req, res) => {
    try {
        let near = req.body.name
        console.log("req", req.body)
        // let { value, pagination, page, rating } = req.body
        let value = req.body.value
        let typeOfBusiness = req.body.typeOfBusiness
        let pagination = req.body.pagination
        let page = req.body.page
        let rating = req.body.rating
        let business = []

        if (typeOfBusiness.length === 0) {
            if (rating === true) {
                business = await businessService.getNearbusinessRandomTopRating(near, value, page, pagination);
            }
            else {
                business = await businessService.getNearbusinessRandom(near, value, page, pagination);
            }
        }
        else {
            if (rating === true) {
                business = await businessService.getNearbusinesstypesTopRating(typeOfBusiness, near, value, page, pagination);
            }
            else {
                console.log("my")
                business = await businessService.getNearbusinesstypes(typeOfBusiness, near, value, page, pagination);
            }
        }
        res.status(200).json({
            message: "Get Range Business",
            data: business
        })
    }
    catch (error) {
        res.status(500).json({
            message: error
        });
    }
}
