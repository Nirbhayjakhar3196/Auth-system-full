const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")

const registerUser = async({name , email , password}) => {

    const existingUser = await User.findOne({email})

    if (existingUser){
        throw new Error("user already registered");
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    return user;
}

const loginUser = async({email , password}) => {

    const user = await User.findOne({email}).select("+password");

    if(!user){
        throw new Error("User Not registered");
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if(!isMatched){
        throw new Error("Invalid Credentials")
    }

    const token = jwt.sign(
        {id : user._id , role : user.role},
        process.env.JWT_SECRET,
        {expiresIn : '7d'}
    )

    return token;
}

module.exports = {registerUser , loginUser}