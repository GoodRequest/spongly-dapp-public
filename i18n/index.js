var en = require('./translations.en.json')

const i18nextConfig = require('../i18next-scanner.config')

const i18n = {
	translations: {
		en
	},
	defaultLang: i18nextConfig.options.defaultLng,
	useBrowserDefault: true
}

module.exports = i18n
