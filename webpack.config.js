const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

let mode = 'development'
if (process.env.NODE_ENV === 'production') {
    mode = 'production'
}

module.exports = {
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: "./public/index.html",
                favicon: "./public/favicon.ico"
            }
        )
    ],
    mode,
    entry: "./src/index.js",
    output:{
        assetModuleFilename: "assets/[name][ext]",
        path: path.join(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    devtool: "source-map",
    devServer: {
        historyApiFallback: { index: "/", disableDotRule: true },
        port: 3000,
        hot: true,
        open: true
    },
    module:{
        rules:[
            {
                test: /\.(jsx|js)$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                options:{
                    cacheDirectory: true,
                    presets:[ "@babel/preset-react", "@babel/preset-env"]
                }
            },
            {
                test: /\.css?$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(svg|png|eot|ttf|woff|woff2])$/,
                type: "asset/resource",
            },
        ]
    }
}