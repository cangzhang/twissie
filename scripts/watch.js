const path = require('path')
const _merge = require('lodash/extend')
const webpack = require('webpack')
const devServer = require('webpack-serve')

const baseConfig = require('../webpack.config.js')

let config = {
    ...baseConfig,
    mode: 'development',
    watch: true,
    devtool: 'cheap-module-source-map',
}

config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
]

module.exports = config

