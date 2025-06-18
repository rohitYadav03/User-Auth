const express = require("express");
const {connectDB} = require("./config/db.js")
const {UserModel} = require("./models/schema.js")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const validator = require("validator");
const {authMiddleware} = require("./middleware/authMiddleware.js")

const app = express();
app.use(express.json());
// we will be using req.body to get data so we nedd midlleware 
// express.json -> this midlleware will parse incoming json to js object , if I am not wrong

app.use(cookieParser());

app.get("/", (req,res) => {
    res.send("working")
})
// routes to build

//1. POST /register
app.post("/register", async(req,res) => {

    // now we need to hash the password before saving to the db 
    const {password} = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    
   try {
     const userData = new UserModel({
        name: req.body.name,
       email : req.body.email,
       password : hashPassword
    })

    await userData.save();
    res.send("should have been saved to the db")
   } catch (error) {
    res.send(`ERROR : ${error.message}`)
   }
    
})

// POST /login -> this is the most important route, from my 
// understing the workflow for this api should be something like this 
//  forst check the email and passwod are correct or not 
// then create the jwt token 
// then send the jwt token in the cookies

app.post("/login", async(req,res) => {
    const {email, password} = req.body;

 if (!email || !validator.isEmail(email)) {
  return res.status(400).json({ error: "Invalid email format" });
}
if(!password){
      return res.status(400).json({ error: "Enter the password" });
}

try {
const validUser = await UserModel.findOne({email : email});
console.log(`valid user : ${validUser}`);
 
if(!validUser){
    throw new Error("Email is not register");
}

// not check for the password , it is correct or not 
 const isPasswordCorrect  = await bcrypt.compare(password, validUser.password); // I know not a good variable name but I cannt get good one


 if (isPasswordCorrect ) {
// now here we know that user has enter a valid email and password , 
// so now we need to create token and send it into cookies

const token = jwt.sign({id : validUser._id}, "Mysecreatcodeis18", {expiresIn : "8h"});

console.log(`token : ${token}`);
// noww we have create the token  then we should send this using cookie
return res.cookie("access-token", token).status(200).json({message: "Logged in successfully 😊👌"})

}else{
    throw new Error("wrong password");
}
}
catch (error) {
res.status(400).json({ error: error.message });
}
})

// GET /profile (Protected Route)
app.get("/profile",authMiddleware, async(req,res) => {
 const userId = req.user.id;

    try {
    // now the the user from this id 
    const getUser = await UserModel.findOne({_id : userId});
    res.send(getUser)
} catch (error) {
    res.status(400).json({ error: error.message });

}

})

connectDB().then(() => {
    console.log("connected to databse successfull");
    app.listen(3000, () => {
        console.log("port 3000");
    })
}).catch((err) => {
    console.log(err)
})