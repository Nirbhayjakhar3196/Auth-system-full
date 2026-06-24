
const authServices = require('../services/authServices')

const register = async (req , res) => {

    try {

        const user = await authServices.registerUser(req.body)

        return res.status(201).json({
            message : "Usesr Registered Successfully",
            user
        })
        
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }

}

const login = async(req, res) => {

    try {

        const {accessToken , refreshToken} = await authServices.loginUser(
            req.body.email,
            req.body.password
        )

        res.status(200).json({
            accessToken,
            refreshToken
        })
        
    } catch (error) {
        return res.status(400).json({
            message : error.message
        })
    }

}

module.exports = {register , login};