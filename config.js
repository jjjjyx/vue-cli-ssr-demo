'use strict'
// module.exports
// const debug = require('debug')('app:config')
const merge = require('lodash/merge')
// const log = require('log4js').getLogger('config')

// 启动参数，与site 无关
const CONFIG = {
    appPort: 8665,
    allowOrigin: 'http://localhost:8665',
    maxAge: 365 * 5 * 60000 * 60 * 24,
    cacheTimeOut: 60 * 60 * 24 * 2, // 单位秒  2 天

    tokenPrefix: 'Bearer',
    tokenHeaderKey: 'authorization',
    tokenExpiration: '1 days'
}

try {
    let pri = require('./private.js')
    merge(CONFIG, pri)
    // log.info('Loading private configuration')
} catch (e) {
    // log.info('Failed to load private configuration!')
}
// Object.keys(CONFIG).forEach((key)=> {
//     if (typeof CONFIG[key] !== 'object') {
//         debug(`${key} = ${CONFIG[key]}` )
//     }
// })

module.exports = CONFIG
