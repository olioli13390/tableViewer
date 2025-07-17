const express = require('express')
const session = require("express-session")
const flash = require("connect-flash")
const userRoutes = require('./src/routes/userRoutes')
const mainRoutes = require('./src/routes/mainRoutes')
const dataBaseConnectionRoutes = require("./src/routes/dataBaseConnectionRoutes")
const sqlQueryRoutes = require("./src/routes/sqlQueryRoutes")
const visualizationRoutes = require("./src/routes/visualizationRoutes")

const app = express()

require('dotenv').config()

app.set('views', './src/views')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"))
app.use(session({
    secret: "olivier",
    resave: true,
    saveUninitialized: true,
    cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}))
app.use(flash())
app.use((req, res, next) => {
    res.locals.toast = req.flash("toast")[0]
    next()
})
app.use(userRoutes)
app.use(mainRoutes)
app.use(dataBaseConnectionRoutes)
app.use(sqlQueryRoutes)
app.use(visualizationRoutes)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Port non connecté");
    }
    else {
        console.log(`Connecté au port ${process.env.PORT}`);
    }
})