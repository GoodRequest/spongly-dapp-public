// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.

import * as Sentry from '@sentry/nextjs'
import { Integrations } from '@sentry/tracing'
import { RewriteFrames as RewriteFramesIntegration } from '@sentry/integrations'
import packageInfo from '/package.json'
import { ENVIROMENT } from './src/utils/constants'

Sentry.init({
	enabled: process.env.NODE_ENV !== ENVIROMENT.DEVELOPMENT,
	dsn: process.env.SENTRY_DSN,
	release: `client@v${packageInfo.version}`,
	environment: process.env.SENTRY_ENV,
	integrations: [new Integrations.BrowserTracing(), new RewriteFramesIntegration()],
	tracesSampleRate: 0.2,
	ignoreErrors: []
})
