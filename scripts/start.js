#!/usr/bin/env node
const http = require('http')
const log4js = require('log4js')
log4js.configure('./log4js.json')

const log = log4js.getLogger('startup')
const app = require('../server')
let { appPort: port } = config
app.set('port', port)

listen()

function listen () {
    function onError (error) {
        if (error.syscall !== 'listen') {
            throw error
        }

        let bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                log.error('%s requires elevated privileges', bind, error)
                return process.exit(1)
            case 'EADDRINUSE':
                log.error('%s is already in use', bind, error)
                return process.exit(1)
            default:
                throw error
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening () {
        let addr = server.address()
        // let host = addr.address
        let port = addr.port
        // let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
        // debug('Listening on ' + bind)
        log.info(`app (%s) listening at http://localhost:%s`, app.get('env'), port)
    }

    /**
     * Create HTTP server.
     */
    let server = http.createServer(app)

    server.listen(port)

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.on('error', onError)
    server.on('listening', onListening)
}
