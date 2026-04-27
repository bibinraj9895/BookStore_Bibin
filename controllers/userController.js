// Import model (as collection in mongoDB)

const users = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Register logic implemented

exports.registerUser=async(req,res)=>{
    console.log("Inside Register Function",req.body);
    const {username,email,password}= req.body
    try{
        const existingUser = await users.findOne({email})
        if(existingUser) {
            res.status(401).json({message: "User already exist..."})
        }
        else{
            const newUser = new users({username,email,password})
            await newUser.save()
            res.status(201).json({message:"User Regiteration Successfull...",newUser})
        }


    }
    catch(err){
        res.status(500),json({message : "Server err",err})

    }
  // res.send("Request Received...")
    
}

// Login logic implemented

exports.loginUser=async(req,res)=>{
    console.log("Inside Login Function",req.body);
    const {email,password}= req.body
    try{
        const existingUser = await users.findOne({email})
        if(existingUser) {
            if(existingUser.password===password){
                const token = jwt.sign({userMail:existingUser.email,userId:existingUser._id},process.env.jwtKey)
                console.log(token);
                
                res.status(200).json({message : "Login successfull",existingUser,token})
            }
            else{
                res.status(401).json({message : "Password Mismatch"})
            }
        }
        else{
            res.status(401).json({message: "User not found..."})
        }


    }
    catch(err){
        res.status(500),json({message : "Server err",err})

    }
  // res.send("Request Received...")
    
}


// Google Login logic implemented

exports.googleLoginUser=async(req,res)=>{
    console.log("Inside Register Function");
    const {email,password,username,profile}= req.body
    try{
        const existingUser = await users.findOne({email})
        if(existingUser) {
              const token = jwt.sign({userMail:existingUser.email,userId:existingUser._id},process.env.jwtKey)
                console.log(token);
              res.status(200).json({message : "Login successfull...",existingUser,token})    
        }
        else{
            const newUser = new users({email,password,username,profile})

            await newUser.save()

            res.status(201).json({message: "User saved Successfully...",newUser,token})
        }

    }
    catch(err){
        res.status(500),json({message : "Server err",err})

    }

    
}

//USER PROFILE UPDATION

exports.updateUserProfile = async(req,res) =>{
    console.log("Inside Update Profile");
    // res.send("req received")
    console.log(req.params);
    const {id} = req.params
    console.log(id);
    //const email = req.payload
    const {username,password,bio} = req.body
    const profile = req.file?req.file.filename : req.body.profile
    try{
        const updateProfile = await users.findByIdAndUpdate({_id:id},{username,password,bio,profile},{new:true})
        res.status(200).json({message : "Updation successfull...",updateProfile})  

    }
    catch(err){
        res.status(500),json({message :"Server err",err})
    }  
    
}

//GET all Users - GET

exports.getAllUsers=async(req,res)=>{
    console.log("Inside Get All Users");

    try{
        const user = await users.find({role:{$ne:"admin"}})
        res.status(200).json({message:"user data fetched",user})
    }
    catch(err){
        res.status(500).json({message:"Server Err",err})
    }
}

//Delete A User
    exports.deleteAUser = async(req,res)=>{
        console.log("Inside delete a User");
        const {id} = req.params

        try{
            const user = await users.deleteOne({_id:id})
            res.status(200).json({message:"User deleted...",user})
        }
        catch(err){
        res.status(500).json({message:"Server Error",err})
        }   
    }




