const path = require('path')
const _merge = require('lodash/extend')
const webpack = require('webpack')
const devServer = require('webpack-dev-server')
const WriteFilePlugin = require("write-file-webpack-plugin")

const baseConfig = require('./webpack.config.js')

const PORT = process.env.PORT || 3000

let config = {
    ...baseConfig,
    mode: 'development',
    devtool: 'cheap-module-source-map',
}

const entries = Object.keys(config.entry)

for (let entryName of entries) {
    config.entry[entryName] = [
        ("webpack-dev-server/client?http://localhost:" + PORT),
        "webpack/hot/dev-server",
        config.entry[entryName],
    ]
}

config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new WriteFilePlugin(),
]

const compiler = webpack(config)

const server = new devServer(compiler, {
    hot: true,
    contentBase: path.join(__dirname, "../public"),
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
})

server.listen(PORT);

