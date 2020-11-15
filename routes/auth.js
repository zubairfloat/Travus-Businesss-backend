const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req , file , cb) {
        cb(null, 'public/images')
    }, 
    filename: function(req , file , cb ){
        cb(null , Date.now()+ file.originalname)
    }
})
const upload = multer({storage: storage})

router.route('/signup')
    .post(authController.createUser)

router.route('/signin')
    .post(authController.userSignIn)
    
router.route('/resend')
    .post(authController.resend)

router.route('/verify')
    .post(authController.verify)

router.route('/forget')
    .post(authController.forget)
    
router.route('/reset')
    .post(authController.reset)

router.route('/update')
    .post(upload.single('image') ,authController.updatedUser)

module.exports = router;