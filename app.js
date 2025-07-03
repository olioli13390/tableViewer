const express = require('express')

const app = express()

require('dotenv').config()

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Port non connecté");
    }
    else {
        console.log(`Connecté au port ${process.env.PORT}`);
    }
})