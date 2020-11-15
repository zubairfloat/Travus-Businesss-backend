const userService = require('../services/user');
const User = require('../models/user');
const { helpers } = require('../helpers');
const Token = require('../models/token');
const crypto = require('crypto');
const moment = require('moment');
moment().format();
const {
  signupSchema,
  signinSchema,
  verificationTokenSchema,
  profileSchema,
} = require('../schemas/auth');

module.exports.createUser = async (req, res, next) => {
  console.log('data is ', req.body);
  const validation = signupSchema.validate(req.body);
  if (validation.error) {
    console.log(validation.error);
    return res.status(400).json({
      message: validation.error.details[0].message,
    });
  }
  try {
    console.log('try object');
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
      return res.status(400).json({
        message: 'Email Already Exists',
      });
    }
    const newUser = new User(req.body);
    await userService.registerUser(newUser);
    res.status(201).json({
      success: newUser,
      message: 'Account is successfully created ',
    });
    // const mail = await helpers.sendEmail(newUser, req, res);
    // if (mail === true) {
    //   res.status(201).json({
    //     success: newUser,
    //     message: 'Account is successfully created and email has been sent.',
    //   });
    // } else {
    //   res.status(400).json({
    //     message: 'not created',
    //   });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.userSignIn = async (req, res, next) => {
  const validation = signinSchema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      message: validation.error.details[0].message,
    });
  }
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (user) {
      if (!user.comparePassword(password)) {
        res.status(402).json({ message: 'Invalid email or password' });
      }
      //   if (!user.isVerified) {
      //     res.status(401).json({ message: 'Your account has not been verified' });
      //   }
      console.log(user);

      const token = user.generateJWT();
      if (!token) {
        res.status(500).json({
          message: 'error in generating token',
        });
      }
      res.status(200).json({
        data: {
          user: {
            userId: user._id,
            username: user.username,
            email: user.email,
            companyName: user.companyName,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            number: user.number,
            gender: user.gender,
            image: user.image,
          },

          token,
        },
        savedVenues: {
          venues: user.savedVenues ? user.savedVenues : [],
        },
      });
    } else {
      res.status(500).json({
        message: "Email doesn't not exists",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports.verify = async (req, res, next) => {
  const tokenCode = verificationTokenSchema.validate(req.body);
  if (!tokenCode) return res.status(400).json({ message: 'token is not provided' });
  try {
    const token = await Token.findOne({ token: req.body.token });
    if (!token) {
      return res.status(400).json({ message: 'invalid Token' });
    }
    const user = await userService.getUserById(token.userId);
    if (!user) {
      return res.status(400).json({ message: 'no user for this token.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: ' user has already been verified.' });
    }
    await userService.verifyUser(user._id);
    res.status(201).json({
      success: true,
      message: 'Account is successfully verified.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.resend = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user)
      return res.status(401).json({
        message: 'The email address ' + req.body.email + ' is not associated with any account',
      });
    if (user.isVerified)
      return res.status(400).json({ message: 'This account has already been verified' });
    helpers.sendEmail(user, req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.forget = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(400).send({ message: 'This email is not valid.' });
    const token = user.generateVerificationToken();
    user.passwordResetToken = token.token;
    user.passwordResetExpires = moment().add(12, 'hours');
    // Send the mail
    user.save(function(err) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      const mail = helpers.sendForGotEmail(user, token, req, res);
      if (mail === true) {
        res.status(201).json({
          success: newUser,
          message: 'A verification mail has been sent.',
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.reset = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.body.code });
    if (!token) {
      return res.status(400).json({ message: 'invalid Token' });
    }
    const user = await userService.getUserById(token.userId);
    if (!user) {
      return res.status(400).json({ message: 'no user for this token.' });
    }
    if (user.passwordResetToken !== token.token)
      return res.status(400).send({
        message:
          "User token and your token didn't match. You may have a more recent token in your mail list.",
      });

    if (moment().utcOffset(0) > user.passwordResetExpires) {
      return res.status(400).send({
        message: 'Token has expired.',
      });
    }
    user.password = req.body.password;
    user.passwordResetToken = 'nope';
    user.passwordResetExpires = moment().utcOffset(0);
    user.save();
    const mail = await helpers.sendResetEmail(user, token, req, res);
    if (mail === true) {
      res.status(201).json({
        success: user,
        message: 'Password has been reset. Please log in.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
module.exports.updatedUser = async (req, res, next) => {
  let data = req.body;
  data.image = req.file.filename;
  const validation = profileSchema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      message: validation.error.details[0].message,
    });
  }
  try {
    const { userId } = req.body;
    const user = await userService.getupdateUserById(userId);
    if (user) {
      try {
        let profile = {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            number: req.body.number,
            gender: req.body.gender,
            image: req.body.image,
          },
        };
        const _id = userId;
        const updatedUser = await userService.updatUserProfile(_id, profile);
        const user = await userService.getupdateUserById(userId);
        if (updatedUser)
          res.status(200).json({
            data: {
              user: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                number: req.body.number,
                gender: req.body.gender,
                image: req.body.image,
                userId: userId,
                username: user.username,
                email: user.email,
                companyName: user.companyName,
              },
            },
          });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(500).json({
        message: "Email doesn't not exists",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
