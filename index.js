require('dotenv').config()
// 1 Import express
const express = require('express')
require('./config/db')

//Import cors and route
const cors = require('cors')
const userRoute = require('./router/userRoute')
const bookRoute = require('./router/bookRoute')

// 2 Create an app using express
const bookStoreServer = express()

bookStoreServer.use(cors())
bookStoreServer.use(express.json())
bookStoreServer.use(userRoute)

bookStoreServer.use(bookRoute)
// photo upload, created upload folder in backend
bookStoreServer.use('/uploads',express.static('./uploads'))


// 3 Port define

const PORT = 3000 || process.env.PORT
// 5 get 3000
bookStoreServer.get('/',(req,res)=>{
    res.send('Book store server started...')
})
//4.app listen
bookStoreServer.listen(PORT,()=>{
    console.log("Book store server running on the port "+PORT);
    
})