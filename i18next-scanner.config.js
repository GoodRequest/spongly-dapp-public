module.exports = {
	input: ['src/**/*.{ts,tsx}'],
	output: './',
	options: {
		debug: false,
		func: {
			list: ['t'],
			extensions: ['.js', '.jsx', '.ts', '.tsx']
		},
		sort: true,
		trans: false,
		removeUnusedKeys: true,
		lngs: ['en'],
		defaultLng: 'en',
		ns: ['translations'],
		defaultNs: 'translations',
		nsSeparator: ':',
		keySeparator: '|',
		defaultValue(lng, ns, key) {
			if (lng === 'en') {
				return key
			}
			return '_NOT_TRANSLATED_'
		},
		resource: {
			loadPath: 'i18n/{{ns}}.{{lng}}.json',
			savePath: 'i18n/{{ns}}.{{lng}}.json',
			jsonIndent: 4,
			lineEnding: '\n'
		}
	}
}
