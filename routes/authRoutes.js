
const express = require('express')
const router = express.Router()

const authController = require('../controller/authController')
const authMiddleware = require('../middleware/authMidlleware')

router.post('/register' , authController.register)
router.post('/login' , authController.login)

router.get('/profile' , authMiddleware , (req,res) => {

    res.json({
        message: "Protected route access granted",
        user: req.user
    })
    
})


module.exports = router