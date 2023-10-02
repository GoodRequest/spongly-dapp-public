import type { AppProps } from 'next/app'
import { useEffect, useState, ReactElement, ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { NextPage } from 'next'
import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import {
	injectedWallet,
	rainbowWallet,
	metaMaskWallet,
	coinbaseWallet,
	walletConnectWallet,
	braveWallet,
	imTokenWallet,
	ledgerWallet,
	trustWallet,
	rabbyWallet
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { optimism, arbitrum, optimismGoerli } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { merge } from 'lodash'
import { QueryClientProvider } from '@tanstack/react-query'

import { Space_Grotesk } from 'next/font/google'
import CustomFont from 'next/font/local'

import { ApolloProvider } from '@apollo/client'
import { ConfigProvider as AntdConfigProvider } from 'antd'

import { usePersistor, useStore } from '@/redux/store'
import { useSSRloading } from '@/hooks/useSSRLoad'

import client from '@/utils/apolloClient'
import { GlobalStyle } from '@/styles/GlobalStyles'
import { theme } from '@/styles/theme'
import darkTokens from '@/styles/darkTokens'

import '@/styles/reset.css'
import { INFURA_ID } from '@/utils/constants'
import queryConnector from '@/utils/queryConnector'

import '@rainbow-me/rainbowkit/styles.css'
import { isAndroid, isMetamask, isMobile } from '@/utils/device'
import useWidgetBotScript from '@/hooks/useWidgetBotScript'

import '../styles/fonts.css'
import '../styles/league-icons.css'

const spageGroteskFont = Space_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--space-grotesk-font' })
const overtimeIcons = CustomFont({
	src: '../assets/fonts/OvertimeIcons.ttf',
	variable: '--overtime-icon-font'
})

const { chains, provider } = configureChains([optimism, arbitrum, optimismGoerli], [infuraProvider({ apiKey: INFURA_ID }), publicProvider()])
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || ''
const connectors = connectorsForWallets([
	{
		groupName: 'Recommended',
		wallets: [
			metaMaskWallet({ chains, projectId }),
			walletConnectWallet({ chains, projectId }),
			rabbyWallet({ chains }),
			braveWallet({ chains }),
			ledgerWallet({ chains, projectId }),
			trustWallet({ chains, projectId }),
			injectedWallet({ chains }),
			coinbaseWallet({ appName: 'Overtime', chains }),
			rainbowWallet({ chains, projectId }),
			imTokenWallet({ chains, projectId })
		]
	}
])

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
})
// PLACEHOLDER TO DO
const customRainbowTheme = merge(darkTheme(), { colors: { modalBackground: '#1A1C2B' } })

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement, props?: any) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
	queryConnector.setQueryClient()
	const store = useStore(pageProps.initialReduxState)
	const persistor = usePersistor(store)

	const [preventDiscordWidgetLoad, setPreventDiscordWidgetLoad] = useState(true)

	useEffect(() => {
		const checkMetamaskBrowser = async () => {
			const isMetamaskBrowser = isMobile() && (await isMetamask())
			// Do not load Discord Widget Bot on Android MM browser due to issue with MM wallet connect
			// issue raised on https://github.com/rainbow-me/rainbowkit/issues/1181
			setPreventDiscordWidgetLoad(isMetamaskBrowser && isAndroid())
		}
		checkMetamaskBrowser()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const getLayout = Component.getLayout ?? ((page: any) => page)

	useWidgetBotScript(preventDiscordWidgetLoad)
	useSSRloading()

	// TODO: antd locales.
	// TODO: rest of the colors from tokens
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle theme={theme} />
			<AntdConfigProvider
				theme={{
					token: {
						colorPrimaryHover: darkTokens['color-base-surface-quintarny'], // '#292C3D',
						colorBgContainer: darkTokens['color-base-surface-secondary']
					}
				}}
			>
				<ApolloProvider client={client}>
					<WagmiConfig client={wagmiClient}>
						<RainbowKitProvider
							chains={chains}
							theme={customRainbowTheme}
							appInfo={{
								appName: 'Overtime'
								// TODO + disclaimer
							}}
						>
							<QueryClientProvider client={queryConnector.queryClient}>
								<PersistGate persistor={persistor}>
									{() => (
										<Provider store={store}>
											<div className={`${spageGroteskFont.variable} ${overtimeIcons.variable}`}>
												{getLayout(<Component {...pageProps} />, pageProps)}
											</div>
										</Provider>
									)}
								</PersistGate>
								{/* <ReactQueryDevtools initialIsOpen={false} /> */}
							</QueryClientProvider>
						</RainbowKitProvider>
					</WagmiConfig>
				</ApolloProvider>
			</AntdConfigProvider>
		</ThemeProvider>
	)
}

export default App
