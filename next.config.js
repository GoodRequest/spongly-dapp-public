/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs')
const withImages = require('next-images')

const nextConfig = {
	webpack(config) {
		return config
	},
	reactStrictMode: true,
	compiler: {
		styledComponents: true,
	},
	distDir: 'dist',
	images: {
		// minimumCacheTTL: 31536000, // cachovanie obrazka na 1 rok
		disableStaticImages: true
	},
	sentry: {
		hideSourceMaps: true
	},
	env: {
		VERSION: process.env.VERSION,
		// SENTRY
		SENTRY_DSN: process.env.SENTRY_DSN,
		SENTRY_ENV: process.env.SENTRY_ENV,
		REACT_APP_WALLET_CONNECT_PROJECT_ID: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID
	}
}


const sentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin
	silent: false // Suppresses all logs
	// For all available options, see:
	  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

const translateRoutesOptions = {
	disableLocaleBasedRouting: true
}

// const exportPathMap = (defaultPathMap, { dev, dir, outDir, distDir, buildId }) => {
//  return {
//      '/': { page: '/' }
//  }
// }

// Define the redirection rule
// const redirects = async () => {
// 	return [
// 		{
// 			source: '/',
// 			destination: '/dashboard',
// 			permanent: true, // Set to true if it's a permanent redirect (301), false for temporary (302).
// 		},
// 	];
// };

module.exports = (_phase, { defaultConfig }) => {
	const plugins = [[withSentryConfig, sentryWebpackPluginOptions], [withImages]]
	return plugins.reduce(
		(acc, plugin) => {
			if (Array.isArray(plugin)) {
				return plugin[0](acc, plugin[1]);
			}
			return plugin(acc);
		},
		{ ...nextConfig, trailingSlash: true }
	)
}
