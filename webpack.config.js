var webpack = require('webpack');
var path = require('path');
var failPlugin = require('webpack-fail-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var PACKAGE = require('./package.json');

module.exports = {
    entry: {
        'index': ["./index.js"],
        datagenerator: "./src/DataGenerator.ts"
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        library: "[name]",
        libraryTarget: 'umd'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    plugins: [
        failPlugin,
        new HtmlWebpackPlugin({
            chunks: [],
            filename: "aggriddemo.html",
            template: 'DemoPage/aggriddemo.ejs',
            inject: false,
            'bundleJs': PACKAGE.version + "/adaptableblotteraggrid-bundle.min.js"
        }),
        new HtmlWebpackPlugin({
            chunks: [],
            filename: "hypergriddemo.html",
            template: 'DemoPage/hypergriddemo.ejs',
            inject: false,
            'bundleJs': PACKAGE.version + "/adaptableblotterhypergrid-bundle.min.js"
        }),
        new HtmlWebpackPlugin({
            chunks: [],
            filename: "index.html",
            template: 'DemoPage/index.ejs',
            inject: false,
            'version': PACKAGE.version,
            'versiondate': new Date().toISOString().slice(0, 10)
        }),
        //this makes sure we package it in the dist folder and make it available for the webpack dev server
        new CopyWebpackPlugin([{ context: 'node_modules/adaptableblotter/dist', from: '*', to: PACKAGE.version + '/' }]),
        new CopyWebpackPlugin([{ from: 'ExtLibs/**/*', to: '' }]),
        new CopyWebpackPlugin([{ from: 'node_modules/adaptableblotter/LICENSE.md', to: '' }]),
        new CopyWebpackPlugin([{ from: 'DemoPage/*', to: '', flatten: true }])
    ],
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            // note that babel-loader is configured to run after ts-loader
            {
                test: /\.ts(x?)$/, loader: 'babel-loader?presets[]=es2015!ts-loader'
            }
        ]
    }
}