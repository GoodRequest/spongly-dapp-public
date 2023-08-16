const StyleDictionaryPackage = require('style-dictionary');

const project = process.env.npm_config_project

function getStyleDictionaryConfig(theme) {
	return {
		"source": [`styled-components-tokens/${project}/${theme}.json`],
		"platforms": {
			"flatten": {
				"transformGroup": "web",
				"buildPath": `styled-components-tokens/${project}/`,
				"files": [{
					"destination": `${theme}.json`,
					"format": "json/flat"
				}]
			},
			"js": {
				"transformGroup": "js",
				"buildPath": "src/styles/",
				"files": [{
					"destination": `${theme}.js`,
					"format": "javascript/module"
				}]
			}
		}
	};
}

['flatten', 'js'].map(function (platform) {
	['darkTokens', 'lightTokens'].map(function (theme) {
		console.log('\n==============================================');
		console.log(`\nProcessing: [${theme}, ${platform}]`);

		const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

		StyleDictionary.buildPlatform(platform);

		console.log('\nEnd processing');
	})
})
