const fs = require('fs')
const path = require('path')
const express = require('express')
const unless = require('express-unless')
const proxy = require('http-proxy-middleware')
const { createBundleRenderer } = require('vue-server-renderer')

const app = express()
const ISDEV = app.get('env') === 'development'
global.ISDEV = ISDEV
global.config = require('./config')

function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        runInNewContext: false
    }))
}

let renderer
const templatePath = path.resolve(__dirname, './src/index.template.html')

const bundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync(templatePath, 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
renderer = createRenderer(bundle, {
    template,
    clientManifest
})

if (ISDEV) {
    // const webpackDevConfig = require('@vue/cli-service/webpack.config')
    // 这里不知道怎么获取端口号  const { host: devServerBaseURL = 'localhost', port: devServerPort = 8080 } = webpackDevConfig.devServer || {}
    // 也不重要，如果更改了端口这里记得改
    const devServerBaseURL = process.env.DEV_SERVER_BASE_URL || 'http://localhost'
    const devServerPort = process.env.DEV_SERVER_PORT || 8080
    const target = `${devServerBaseURL}:${devServerPort}`
    app.use('/js/main*', proxy({
        target,
        changeOrigin: true,
        pathRewrite: function (path) {
            return path.includes('main') ? '/main.js' : path
        },
        prependPath: false
    }))

    app.use('/*hot-update*', proxy({
        target,
        changeOrigin: true
    }))

    app.use('/sockjs-node', proxy({
        target,
        changeOrigin: true,
        ws: true
    }))
} else {
    let staticDir = express.static(path.join(__dirname, './dist'), {
        maxAge: '30d'
    })
    staticDir.unless = unless
    app.use(staticDir.unless({ method: 'OPTIONS' }))
}

app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'text/html')

    const context = {
        title: 'Vue HN 2.0', // default title
        url: req.url
    }

    renderer.renderToString(context, (err, html) => {
        if (err) {
            if (err.url) {
                res.redirect(err.url)
            } else {
                // Render Error Page or Redirect
                res.status(500).end('500 | Internal Server Error')
                console.error(`error during render : ${req.url}`)
                console.error(err.stack)
            }
        }
        res.status(context.HTTPStatus || 200)
        res.send(html)
    })
})

module.exports = app
