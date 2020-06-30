module.exports = (ctx) => ({
	plugins: {
		'postcss-preset-env': {
			stage: 0,

			features: {
				'custom-properties': {
					preserve: false,
					variables: {}
				}
			}
		}
	}
});
