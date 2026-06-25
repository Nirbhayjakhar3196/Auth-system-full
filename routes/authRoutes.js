
const express = require('express')
const router = express.Router()

const {register , login , refreshToken , logout} = require('../controller/authController')
const authMiddleware = require('../middleware/authMidlleware')

router.post('/register' , register)
router.post('/login' , login)
router.post('/refresh-token' , refreshToken)
router.post('/logout' , logout)

router.get('/profile' , authMiddleware , async (req,res) => {

    try {
        const User = require('../models/userModel')
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        res.json({
            message: "Protected route access granted",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
    
})


module.exports = router