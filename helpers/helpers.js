const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: 'zubairdev786@gmail.com',
    pass: '',
  },
});
const sendEmail = async (user, req, res) => {
  const token = user.generateVerificationToken();
  const mailOptions = {
    to: user.email,
    from: process.env.FROM_EMAIL,
    subject: 'Account Verification Code',
    text: `Hi ${user.email} \n 
                Please visit this link to verify your email this code https://secure-lake-14290.herokuapp.com/VerifyEmail?code=${token.token} . \n\n`,
  };
  try {
    const tokenSaved = await token.save();
    if (!tokenSaved) {
      return false;
      // return res.status(500).json({ message: err.message });
    }
    await transporter.sendMail(mailOptions);
    return true;
    // return res.status(201).json({
    //   success: true,
    //   message: "Account is successfully created. A verification email has been sent.",
    //   user: user
    // });
  } catch (err) {
    console.log(err);
    return false;
    return res.status(500).json({ message: err.message });
  }
};

const sendForGotEmail = async (user, token, req, res) => {
  const mailOptions = {
    to: user.email,
    from: process.env.FROM_EMAIL,
    subject: 'Reset password link',
    text: 'Some useless text',
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n
        <a href="https://secure-lake-14290.herokuapp.com/reset?code=${token.token}">https://secure-lake-14290.herokuapp.com/reset?code=${token.token}</a> \n\n If you did not request this, please ignore this email and your password will remain unchanged.\n </p>`,
  };
  try {
    const tokenSaved = await token.save();
    if (!tokenSaved) {
      return false;
    }
    await transporter.sendMail(mailOptions);
    return res.status(201).json({
      success: true,
      message: 'Account is successfully created. A verification email has been sent.',
      user: user,
    });
  } catch (err) {
    console.log(err);
    return false;
  }
};

const sendResetEmail = async (user, req, res) => {
  const mailOptions = {
    to: user.email,
    from: process.env.FROM_EMAIL,
    subject: 'Your password has been changed',
    text: 'Some useless text',
    html: `<p>This is a confirmation that the password for your account ${user.email} has just been changed. </p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  sendEmail,
  sendForGotEmail,
  sendResetEmail,
};
