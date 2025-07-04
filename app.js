const express = require('express')
const userRoutes = require('./src/routes/userRoutes')

const app = express()

require('dotenv').config()

app.set('views', './src/views')

app.use(userRoutes)
app.use(express.static("./public"))

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Port non connecté");
    }
    else {
        console.log(`Connecté au port ${process.env.PORT}`);
    }
})