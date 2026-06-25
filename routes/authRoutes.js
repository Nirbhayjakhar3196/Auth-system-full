
const express = require('express')
const router = express.Router()

const {register , login , refreshToken , logout} = require('../controller/authController')
const authMiddleware = require('../middleware/authMidlleware')

router.post('/register' , register)
router.post('/login' , login)
router.post('/refresh-token' , refreshToken)
router.post('/logout' , authMiddleware , logout)

router.get('/profile' , authMiddleware , (req,res) => {

    res.json({
        message: "Protected route access granted",
        user: req.user
    })
    
})


module.exports = router