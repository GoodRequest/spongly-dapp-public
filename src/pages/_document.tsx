import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const sheet = new ServerStyleSheet()
		const originalRenderPage = ctx.renderPage
		const cache = createCache()

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						sheet.collectStyles(
							<StyleProvider cache={cache}>
								<App {...props} />
							</StyleProvider>
						)
				})

			const style = extractStyle(cache, true)
			const initialProps = await Document.getInitialProps(ctx)
			return {
				...initialProps,
				styles: [initialProps.styles, <style dangerouslySetInnerHTML={{ __html: style }} />, sheet.getStyleElement()]
			}
		} finally {
			sheet.seal()
		}
	}

	render() {
		return (
			<Html>
				<Head>
					<meta charSet={'utf-8'} />
					{/* TODO: <link rel={'icon'} href={'/favicon.ico'} /> */}
				</Head>
				<body>
					<Main />
					<div id='modal-root' /> {/* modal portal */}
					<NextScript />
				</body>
			</Html>
		)
	}
}
