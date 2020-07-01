import FS from 'fs';
import Path from 'path';
import Webpack from 'webpack';
import MultiEntryPlugin from 'webpack/lib/MultiEntryPlugin';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import DynamicEntryPlugin from 'webpack/lib/DynamicEntryPlugin';
import Glob from 'glob';
import * as Interfaces from './interfaces';


class MiniprogramWebpackPlugin
{
	protected options: Interfaces.Options = {
		ignore: []
	};

	public constructor(readonly custom_options?: Interfaces.Options)
	{
		if (typeof custom_options !== undefined) {
			this.options = Object.assign({}, this.options, custom_options);
		}
	}

	public async apply(compiler: Webpack.Compiler)
	{
		const {options: webpack_options} = compiler;
		const miniprogram_context = webpack_options.context;
		const miniprogram_entry = (typeof webpack_options.entry === 'string')
			? webpack_options.entry
			: (webpack_options.entry as Webpack.Entry)['app']
		;

		compiler.hooks.entryOption.tap(this.constructor.name, (
			context,
			entry
		) => {
			const paths = Glob.sync('**/*.*(ts|css|pug|json)', {
				cwd: typeof miniprogram_context !== 'undefined'
					? Path.join(miniprogram_context, './src')
					: undefined
				,
				ignore: [
					'@types/**/*',
					'**/*.d.ts'
				].concat(this.options.ignore)
			});

			const exts = {
				'.ts': '',
				'.pug': '.wxml',
				'.css': '.wxss',
				'.json': '.json'
			};

			paths.map((file_path) => {
				const path_info = Path.parse(file_path);

				this.entry_plugin(
					miniprogram_context + '/src/',
					file_path,
					Path.join(
						path_info.dir,
						`${path_info.name}${exts[path_info.ext as keyof typeof exts]}`
					)
				).apply(compiler);

				return file_path;
			});


			return true;
		});

		compiler.hooks.compilation.tap(this.constructor.name, (
			compilation
		) => {
			compilation.hooks.chunkAsset.tap(this.constructor.name, (
				chunk,
				filename
			) => {
				const assets_suffix = [
					'.wxss.js',
					'.wxml.js',
					'.json.js'
				];

				const assets_suffix_reg_exp = assets_suffix
					.map( suffix => suffix.replace(/(\.)/g, '\\$1') )
					.join('|')
				;

				const is_asset_reg_exp = new RegExp(
					`.+(${assets_suffix_reg_exp})$`
				);

				const is_asset = filename.match(is_asset_reg_exp) !== null;

				if (!is_asset) {
					return false;
				}

				chunk.files = chunk.files.filter(file => file !== filename);
				delete compilation.assets[filename];
			});
		});
	}

	protected entry_plugin(
		context: string,
		entry: string | string[] | Function,
		name?: string
	): typeof SingleEntryPlugin | typeof MultiEntryPlugin | typeof DynamicEntryPlugin {
		if (typeof entry === 'function') {
			return new DynamicEntryPlugin(context, entry);
		}

		const EntryPlugin = (entry instanceof Array) ?
			MultiEntryPlugin : SingleEntryPlugin
		;

		return new EntryPlugin(context, entry, name);
	}
}

export default MiniprogramWebpackPlugin;
