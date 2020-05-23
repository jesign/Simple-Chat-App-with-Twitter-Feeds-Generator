const { Router } = require('express')

const router = Router()

// Initialize Controller
const twitterController = require('../controllers/TwitterController')

// Get User
router.get('/twitter/feeds', twitterController.covidFeeds)

module.exports = router