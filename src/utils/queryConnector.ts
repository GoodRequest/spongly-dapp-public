import { QueryClient } from '@tanstack/react-query'

type QueryConnector = {
	queryClient: QueryClient
	setQueryClient: () => void
}

// @ts-ignore
const queryConnector: QueryConnector = {
	setQueryClient() {
		if (this.queryClient === undefined) {
			this.queryClient = new QueryClient()
		}
	}
}

export default queryConnector
