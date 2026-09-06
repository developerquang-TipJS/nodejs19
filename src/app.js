const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const { checkOverLoad } = require("./helpers/check.connects")
const app = express()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
// init db
require('./dbs/init.mongodb')
checkOverLoad()
// init routers
app.get("/", (req, res, next) => {
    const str = "hello quang"
    return res.status(200).json({
        message: 'Welcome home page',
        metadata: str.repeat(1000000)
    })
})
module.exports = app