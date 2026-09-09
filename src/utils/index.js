'use strict'

const _ = require('lodash')

const getInforData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const asyncHandler = fn => {
    return (req,res,next) => {
        fn(req,res,next).catch(next)
    }
}

module.exports = {
    getInforData,
    asyncHandler
}