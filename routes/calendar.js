const express = require('express')
const router = express.Router()
const calendarController = require('../controllers/calendar') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, calendarController.getCalendar) //requested from auth controller after login or signup

router.post('/postGenerateCalendar', ensureAuth, calendarController.postGenerateCalendar) //requested when generateing the training plan

module.exports = router