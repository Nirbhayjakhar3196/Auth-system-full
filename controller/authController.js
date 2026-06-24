
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

        const token = await authServices.loginUser(req.body)
        
        return res.status(200).json({
            message : "Login successfully",
            token
        })
        
    } catch (error) {
        return res.status(400).json({
            message : error.message
        })
    }

}

module.exports = {register , login};