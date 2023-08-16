import { isWindowReady } from './helpers'

export const isMobile = () => {
	if (isWindowReady()) {
		return window.innerWidth < 950
	}
	return false
}

export const isFirefox = () => navigator.userAgent.toLowerCase().indexOf('firefox') > -1

export const isMetamask = async () => {
	if (isWindowReady()) {
		return false
	}
	if (!window.ethereum) {
		return false
	}
	const clientVersion = await window.ethereum.request({
		method: 'web3_clientVersion'
	})
	const isMetamaskClientVersion = clientVersion.split('/')[0] === 'MetaMask'

	return window && window.ethereum.isMetaMask && isMetamaskClientVersion
}

export const isIos = () => {
	if (isWindowReady()) {
		return false
	}
	// @ts-ignore
	const userAgent = navigator.userAgent || window.opera
	return (
		// @ts-ignore
		(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
		// iPad on iOS 13 detection
		(userAgent.includes('Mac') && 'ontouchend' in document)
	)
}

export const isAndroid = () => {
	if (isWindowReady()) {
		return false
	}
	// @ts-ignore
	const userAgent = navigator.userAgent || window.opera
	return /android/i.test(userAgent)
}
