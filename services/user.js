const User = require('../models/user');

const registerUser = (newUser) => {
    return newUser.save();
}

const verifyUser = (_id) => {
    return User.updateOne({_id}, {$set: {isVerified: true}})
}
const getUserByEmail = (email) => {
    return User.findOne({ email }).populate('savedVenues');
    
}
const getUserById = (id) => {
    return User.findOne({ _id: id })
}
const getupdateUserById = (userId) => {
    return User.findOne({ _id: userId }).lean().exec();
}
const updatUserProfile = (_id, profile) => {
    return User.updateOne({ _id }, profile);
}

const userService = {
    registerUser,
    getUserByEmail,
    getUserById,
    updatUserProfile,
    verifyUser,
    getupdateUserById
}
module.exports = userService;
