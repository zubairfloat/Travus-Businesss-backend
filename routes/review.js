const express = require('express');
const router = express.Router();
const reviewController = require('../controller/review.controller');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/reviews')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({ storage: storage });

router.route('/write')
    .post(upload.single('image'), reviewController.addReview);
    
router.route('/getReview')
    .post(reviewController.getAllReviews)

module.exports = router;
