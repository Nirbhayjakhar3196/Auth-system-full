const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")

const {generateAccessToken , generateRefreshToken} = require("../utils/tokenUtils")

const registerUser = async ({ name, email, password }) => {


    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("user already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken

    await user.save()

    return {
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    }
}

const refreshToken = async(incomingRefreshToken) => {

    const decoded = jwt.verify(incomingRefreshToken , process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if(!user){
        throw new Error("Invalid User")
    }

    if(user.refreshToken != incomingRefreshToken){
        throw new Error("Invalid refresh Token")
    }

    const newAccessToken = generateAccessToken(user)

    return {
        accessToken: newAccessToken
    }
}

const logoutUser = async(incomingRefreshToken) => {

    if (!incomingRefreshToken) {
        throw new Error("Refresh token is required")
    }

    const user = await User.findOne({ refreshToken: incomingRefreshToken });
    
    if(user){
        user.refreshToken = null
        await user.save()
    }

    return {
        message: "Logged out successfully"
    }
}

module.exports = {registerUser , loginUser , refreshToken , logoutUser}