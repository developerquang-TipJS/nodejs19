'use strict'

const mongoose = require("mongoose")
const os = require("os")
const process = require("process")

const countConnects = () => {
    return mongoose.connections.length
}

const checkOverLoad = () => {
    const numConnects = countConnects()
    const numCores = os.cpus().length
    // tổng lượng bộ nhớ RAM mà process Node.js đang chiếm trong hệ điều hành trả về đơn vị bytes
    const memoryUsage = process.memoryUsage().rss
    const maxConnects = numConnects * 5
    console.log(`numCores : ${numCores}`)

    setInterval(() => {
        console.log(`memoryUsage : ${memoryUsage / 1024 / 1024} MB`)
        if (numConnects > maxConnects) {
            console.log(`Connection overload`)
        }
    }, 5000)
}
module.exports = {
    countConnects,
    checkOverLoad
}