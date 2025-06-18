const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://rohityadav85801:ApkSBvXBgdOlE5JW@originaltinder.xae1zzc.mongodb.net/userAuth")
}

module.exports = {connectDB};