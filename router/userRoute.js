// 1 Import express
const express = require('express')


// 4 Import userController

const userController = require('../controllers/userController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
const adminJwtMiddleware = require('../middlewares/adminJwtMiddleware')


// 2 Route define
const userRoute = express.Router()

//RegisterAPI = endpoints define
userRoute.post('/api/register',userController.registerUser)

//LoginAPi
userRoute.post('/api/login',userController.loginUser)

//GoogleLoginAPi
userRoute.post('/api/googleLogin',userController.googleLoginUser)

//USER PROFILE UPDATION -endpoints define
userRoute.put('/api/updateProfile/:id',jwtMiddleware,multerMiddleware.single('profile'),userController.updateUserProfile)

//Get all users
userRoute.get('/api/getAllUsers',adminJwtMiddleware,userController.getAllUsers)

//DELETE A User - ADMIN
userRoute.delete('/api/deleteAUser/:id',adminJwtMiddleware,userController.deleteAUser)

// 3 export Route
module.exports = userRoute