const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")

const {generateAccessToken , generateRefreshToken} = require("../utils/tokenUtils")

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

    console.log("EMAIL RECEIVED:", email);

    const user = await User.findOne({email}).select("+password");

     console.log("USER FOUND:", user);

    if(!user){
        throw new Error("User Not registered");
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if(!isMatched){
        throw new Error("Invalid Credentials")
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken

    await user.save()

    return {
        accessToken,
        refreshToken
    }
}

const refreshToken = async(incomingRefreshToken) => {

    const decoded = jwt.verify(incomingRefreshToken , process.env.refreshToken);

    const user = await User.findById(decoded.id);

    if(!user){
        throw new Error("Invalid User")
    }

    if(user.refreshToken != incomingRefreshToken){
        throw new Error("Invalid refresh Token")
    }

    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    user.refreshToken = newRefreshToken

    await user.save()

    return {
        newAccessToken,
        newRefreshToken
    }

}

module.exports = {registerUser , loginUser , refreshToken}