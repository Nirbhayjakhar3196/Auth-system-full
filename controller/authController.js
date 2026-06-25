
const authServices = require('../services/authServices')

const register = async (req, res) => {

    console.log(req.body);

    try {
        const user = await authServices.registerUser(req.body);

        return res.status(201).json({
            message: "User Registered Successfully",
            user
        });

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            message: error.message
        });
    }
}

const login = async(req, res) => {

    try {

        const {accessToken , refreshToken, user} = await authServices.loginUser({
            email : req.body.email,
            password : req.body.password
        })

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user
        })
        
    } catch (error) {
        return res.status(400).json({
            message : error.message
        })
    }

}

const refreshToken = async(req , res) => {

    try {

        const result = await authServices.refreshToken(req.body.refreshToken)

        return res.status(200).json(result)
        
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }

}

const logout = async(req , res) => {

    try {

        const result = await authServices.logoutUser(req.body.refreshToken)

        return res.status(200).json(result)
        
    }
    catch (error) {
        res.status(400).json({
            message : error.message
        })
    }

}

module.exports = {register , login , refreshToken , logout};