'use strict'

// learn
const configLearn = {
    app: {
        port: 3000
    },
    db: {
        host: '127.0.0.1',
        port: '27017',
        name: 'shopDev'
    }
}

// work
const configDev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || '127.0.0.1',
        port: process.env.DEV_DB_PORT || '27017',
        name: process.env.DEV_DB_NAME || 'shopDev'
    }
}
const configProd = {
    app: {
        port: process.env.PROD_APP_PORT
    },
    db: {
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        name: process.env.PROD_DB_NAME
    }
}
const config = { configDev, configProd }
const env = process.env.NODE_ENV || 'configDev'

module.exports = config[env]