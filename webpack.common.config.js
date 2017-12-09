const webpack = require('webpack');
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		"js/bundle": "./src/index.js"
	},
	output: {
		filename: "[name].js",
		path: path.resolve(process.cwd(), "dist")
	},

	module: {
		rules: [
            {
                test: /(\.js)$/,
                exclude: /(node_modules)|(test)/,
                loader: "babel-loader"
		    },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
	},
};
