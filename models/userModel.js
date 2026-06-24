const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    name:{
        type: String
    },
    email:{
        type:String,
        required: true,
        unique : true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        default:"user"
    },
    refreshToken:{
        type:String,
        default: null
    }

} , {timestamps:true});

module.exports = mongoose.model("User" , userSchema);