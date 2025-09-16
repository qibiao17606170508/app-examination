module.exports = {
	configureWebpack: {
		output: {
			"filename": "[name].js",
			"library": "[name]",
			"libraryTarget": "umd"
		}
	}
}