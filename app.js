const express = require('express')
const session = require("express-session")
const userRoutes = require('./src/routes/userRoutes')
const mainRoutes = require('./src/routes/mainRoutes')
const dataBaseConnectionRoutes = require("./src/routes/dataBaseConnection")

const app = express()

require('dotenv').config()

app.set('views', './src/views')
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"))
app.use(session({
    secret: "olivier",
    resave: true,
    saveUninitialized: true,
}))
app.use(userRoutes)
app.use(mainRoutes)
app.use(dataBaseConnectionRoutes)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Port non connecté");
    }
    else {
        console.log(`Connecté au port ${process.env.PORT}`);
    }
})