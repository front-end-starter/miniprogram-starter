/// <reference path="./@types/index.d.ts" />

import type { Configuration } from 'webpack';

import * as Path from 'path';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import TsconfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniprogramWebpackPlugin from './miniprogram_webpack_plugin';


delete process.env.TS_NODE_PROJECT

export const config: Configuration = {
	context: Path.join(__dirname, '../'),

	entry: {
		'app': './src/app'
	},

	resolve: {
		modules: [
			'node_modules'
		],

		extensions: ['.ts', '.js'],

		plugins: [
			PnpWebpackPlugin,
			new TsconfigPathsWebpackPlugin()
		]
	},

	resolveLoader: {
		plugins: [
			PnpWebpackPlugin.moduleLoader(module),
		],
	},

	module: {
		rules: [
			{
				test: /^[^\.]*\.ts$/,
				loader: require.resolve('ts-loader')
			},

			{
				test: /^[^\.]*\.wxs\.ts$/,
				use: [
					{
						loader: require.resolve('file-loader'),
						options: {
							name: '[path][name]',
							context: 'src'
						}
					},
					{ loader: require.resolve('ts-loader') }
				]
			},

			{
				test: /\.css$/,
				use: [
					{
						loader: require.resolve('file-loader'),
						options: {
							name: '[path][name].wxss',
							context: 'src'
						}
					},
					{ loader: require.resolve('extract-loader') },
					{ loader: require.resolve('css-loader') },
					{
						loader: require.resolve('postcss-loader'),
						options: {
							config: {
								path: __dirname
							}
						}
					}
				]
			},

			{
				test: /\.pug$/,
				use: [
					{
						loader: require.resolve('file-loader'),
						options: {
							name: '[path][name].wxml',
							context: 'src'
						}
					},
					{ loader: require.resolve('extract-loader') },
					{ loader: require.resolve('html-loader') },
					{ loader: require.resolve('pug-html-loader') }
				]
			},

			{
				test: /\.json$/,
				type: 'javascript/auto',
				use: [
					{
						loader: require.resolve('file-loader'),
						options: {
							name: '[path][name].json',
							context: 'src'
						}
					}
				]
			}
		]
	},

	plugins:[
		new CleanWebpackPlugin(),
		new MiniprogramWebpackPlugin({
			ignore: [
				'store/**/*'
			]
		})
	]
};
