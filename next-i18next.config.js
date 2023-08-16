const path = require('path')

const i18nextConfig = require('./i18next-scanner.config')

module.exports = {
	i18n: {
		locales: i18nextConfig.options.lngs,
		defaultLocale: i18nextConfig.options.defaultLng
	},
	localePath: path.resolve('./public/locales'),
	ns: i18nextConfig.options.ns,
	nsSeparator: i18nextConfig.options.nsSeparator,
	keySeparator: i18nextConfig.options.keySeparator,
	defaultNS: i18nextConfig.options.defaultNs
}
