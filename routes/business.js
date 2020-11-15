const express = require('express');
const router = express.Router();
const businessControl = require('../controller/business.controller');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({ storage: storage })
router.route('/add')
    .post(upload.single('image'), businessControl.createBusiness)

router.route('/')
    .post(businessControl.getBusiness)

router.route('/all')
    .post(businessControl.getAllBusiness)

router.route('/allList')
    .post(businessControl.searchBusiness)

router.route('/update')
    .post(businessControl.businessUpdate)

router.route('/api')
    .get(businessControl.getApiDataForSquare)

router.route('/callForSquare')
    .post(businessControl.getForsquare)

router.route('/city')
    .post(businessControl.getBusinessByCity);

router.route('/name')
    .get(businessControl.getBusinessByName);

router.route('/claim')
    .get(businessControl.getBusinessClaim);

router.route('/venueName')
    .get(businessControl.getBusinessVenueName);

router.route('/exploreSearch')
    .get(businessControl.getBusinessExploreSearch);

router.route('/updateViews')
    .get(businessControl.updateBusinessViews);

router.route('/trending')
    .get(businessControl.trendingBusiness);

router.route('/near')
    .post(businessControl.nearBusiness);

module.exports = router;