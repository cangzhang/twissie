const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cleanPlugin = require('clean-webpack-plugin')

const appDir = require('./util')()

module.exports = {
    entry: {
        background: appDir + '/src/index.js',
    },

    output: {
        path: appDir + '/public',
        filename: '[name].bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
                // options: {
                //     cacheDirectory: true,
                // },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    // context: '',
                    outputPath: 'images/',
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: __dirname + '/public/background.html',
            chunks: ['background'],
        }),

        new CopyWebpackPlugin([
            'src/manifest.json',
            'src/favicon.ico',
            'src/icon.png',
        ]),

        new cleanPlugin(['public']),
    ],

    node: {
        fs: "empty",
        child_process: "empty",
    }
}