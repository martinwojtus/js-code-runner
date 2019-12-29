const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    entry: {
        view: "./src/main.js",
        css: "./style/index.scss"
    },
    output: {
        filename: "[name].jcr.js",
        // path: path.resolve(__dirname, 'dist'),
        library: 'JsCodeRunner',
        publicPath: "../dist/"
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: [
                    {loader: 'babel-loader'}
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // fallback to style-loader in development
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'jcr.css',
            chunkFilename: 'jcr.css',
        }),
    ],
};
