const path = require('path')
const _merge = require('lodash/merge')
const webpack = require('webpack')
const devServer = require('webpack-serve')

const baseConfig = require('../webpack.config.js')

const conf = _merge(
    baseConfig, 
    {
        mode: 'development',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ]
    }
)

const compiler = webpack(conf)

const port = process.env.PORT || 3000

const server = new devServer(
    compiler, 
    {
        hot: true,
        open: true,
        overlay: true,
        compress: true,
        // stats: 'errors-only',
        port,
        contentBase: path.resolve('public'),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    }
)

server.listen(port);

