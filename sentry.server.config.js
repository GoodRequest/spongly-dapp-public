// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.

import * as Sentry from '@sentry/nextjs'
import { Integrations } from '@sentry/tracing'
import { RewriteFrames as RewriteFramesIntegration } from '@sentry/integrations'
import packageInfo from '/package.json'
import { ENVIROMENT } from './src/utils/constants'

Sentry.init({
	enabled: process.env.NODE_ENV !== ENVIROMENT.DEVELOPMENT,
	dsn: process.env.SENTRY_DSN,
	release: `server@v${packageInfo.version}`,
	environment: process.env.SENTRY_DSN,
	integrations: [new Integrations.BrowserTracing(), new RewriteFramesIntegration()],
	tracesSampleRate: 0.2,
	ignoreErrors: []
})
