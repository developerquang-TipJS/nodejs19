'use strict'

const mongoose = require('mongoose')

const connectString = `mongodb://localhost:27017/shopDev`

// Singleton Pattern : Đảm bảo một class chỉ có một instance trong toàn bộ application.
class Database {
    // auto run when create new Database instance
    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString).then(_ => console.log(`Connected Mongodb success`)).catch(err => console.log(`Error connect: ${err}`))
    }
    // static nghĩa là method này thuộc về class, không thuộc về object.
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb