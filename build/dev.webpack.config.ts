import type { Configuration } from 'webpack';

import * as Path from 'path';
import MergeWebpackPlugin from 'webpack-merge';
import { config as common_config } from './common.webpack.config';

const config: Configuration = MergeWebpackPlugin(common_config, {
	mode: 'development',

	devtool: 'inline-cheap-module-source-map',

	watch: true,
	watchOptions: {
		ignored: /node_modules/
	},

	output: {
		path: Path.join(__dirname, '../dist/'),
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[name].js',
	}
});

export default config;
