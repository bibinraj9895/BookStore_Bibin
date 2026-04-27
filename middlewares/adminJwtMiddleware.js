const jwt = require('jsonwebtoken')

const adminJwtMiddleware = (req,res,next)=>{
    console.log("inside adminJwtMiddleware");
    
    try{
        const token = req.headers.authorization.slice(7)
    console.log(token);
        jwtverification = jwt.verify(token,process.env.jwtKey)
        console.log(jwtverification);
        req.payload = jwtverification.userMail
        console.log(req.payload);
        
        if(jwtverification.userMail=="admin@gmail.com"){
            next()
        }else{
            res.status(401).json("Unauthorised user!!!")
        }
    }catch(err){
        res.status(401).json("Authorization error",err)
    }
}

module.exports = adminJwtMiddleware