const express = require('express')
const router = express.Router()
const calendarController = require('../controllers/calendar') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, calendarController.getCalendar) //requested from auth controller after login or signup

router.post('/postGenerateCalendar', ensureAuth, calendarController.postGenerateCalendar) //requested when generateing the training plan

// router.post('/createTodo', todosController.createTodo) //requested from form on todos.ejs

// router.put('/markComplete', todosController.markComplete) //Requested from client side main.js

// router.put('/markIncomplete', todosController.markIncomplete) //Requested from client side main.js

// router.put('/updateStatus', todosController.updateStatus) //Requested from client side main.js

// router.delete('/deleteTodo', todosController.deleteTodo) //Requested from client side main.js

module.exports = router