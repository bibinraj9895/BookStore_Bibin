// 1 Import express
const express = require('express')

// 4 Import User Controller
const userController = require('../controllers/userController')
const adminJwtMiddleware = require('../middlewares/adminJwtMiddleware')


// 2 Route define
const adminRoute = express.Router()

//ADMIN Login API
adminRoute.post('/api/login',userController.loginUser)


// 3 export Route
module.exports = adminRoute