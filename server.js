require("dotenv").config();

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())

app.use('/api/auth' , authRoutes)

connectDB()

app.listen(process.env.PORT , () => {
    console.log("Server is running");
    
})
