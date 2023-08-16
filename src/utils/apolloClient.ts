import { ApolloClient, ApolloLink, createHttpLink, DefaultOptions, InMemoryCache } from '@apollo/client'
import { NETWORK_IDS, THALES_URL_GOERLI, THALES_URL_OPTIMISM_GOERLI, THALES_URL_OVERTIME_ARBITRUM, THALES_URL_SPORT_MARKETS_OPTIMISM } from './constants'

const httpLinkOptimism = createHttpLink({
	uri: THALES_URL_SPORT_MARKETS_OPTIMISM
})

const httpLinkArbitrum = createHttpLink({
	uri: THALES_URL_OVERTIME_ARBITRUM
})

const httpLinkOptimismGoerli = createHttpLink({
	uri: THALES_URL_OPTIMISM_GOERLI
})

const httpLinkGoerli = createHttpLink({
	uri: THALES_URL_GOERLI
})

const defaultOptions: DefaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'ignore'
	},
	query: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'all'
	}
}

const client = new ApolloClient({
	link: ApolloLink.split(
		(operation) => operation.getContext()?.chainId === NETWORK_IDS.ARBITRUM,
		httpLinkArbitrum,
		ApolloLink.split(
			(operation) => operation.getContext()?.chainId === NETWORK_IDS.OPTIMISM_GOERLI,
			httpLinkOptimismGoerli,
			ApolloLink.split((operation) => operation.getContext()?.chainId === NETWORK_IDS.GOERLI, httpLinkGoerli, httpLinkOptimism)
		)
	),
	cache: new InMemoryCache({
		// disable cache
		dataIdFromObject: () => undefined
	}),
	defaultOptions
})

export default client
