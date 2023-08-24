import { NetworkId } from '@/utils/network'

interface RequestArguments {
	method: string
	params?: unknown[] | Record<string, unknown>
}

declare global {
	interface Window {
		ethereum?: {
			on: (event: string, cb: () => void) => void
			networkVersion: NetworkId
			request: (args: RequestArguments) => Promise<unknown>
			isMetaMask: boolean
		}
	}
}
