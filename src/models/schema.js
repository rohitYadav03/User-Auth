const mongoose = require("mongoose");
const validator = require("validator");

// building the schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 30
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Enter a valid email");
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("Enter a strong password");   
            }
        }
    }
});

// not creating the models from this schema , 
// what i understand till now from schema and models is 
// schema is like a class and model is the object which is created from the class 

const UserModel = mongoose.model("userModel", userSchema);

module.exports = {
    UserModel
}