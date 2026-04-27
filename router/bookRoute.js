const express = require('express')

const bookController = require('../controllers/bookController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
const adminJwtMiddleware = require('../middlewares/adminJwtMiddleware')


const bookRoute = express.Router()

// ADD BOOK
bookRoute.post('/api/addbook',jwtMiddleware,multerMiddleware.array('uploadedImages',3),bookController.addBook)

//VIEW BOOK
bookRoute.get('/api/viewBooks',jwtMiddleware,bookController.viewBooks)

//HOME BOOK
bookRoute.get('/api/homeBooks',bookController.homeBooks)

//GET A BOOK
bookRoute.get('/api/getABook/:id',jwtMiddleware,bookController.getABook)

//GET ALL BOOK - ADMIN
bookRoute.get('/api/getAllBooks',adminJwtMiddleware,bookController.getAllBooks)

//DELETE A BOOK - ADMIN
bookRoute.delete('/api/deleteABook/:id',adminJwtMiddleware,bookController.deleteABook)

//APPROVE A BOOK - ADMIN
bookRoute.put('/api/approveABook/:id',adminJwtMiddleware,bookController.approveABook)


//REJECT A BOOK - ADMIN
bookRoute.put('/api/rejectABook/:id',adminJwtMiddleware,bookController.rejectABook)

//Make Payment - User
bookRoute.put('/api/makepayment',jwtMiddleware,bookController.makePayment)





module.exports = bookRoute 