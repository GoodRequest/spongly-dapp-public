export const setToLS = (key: string, value: any) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(key, JSON.stringify(value))
	}
}

export function getFromLS<T>(key: string): T | undefined {
	if (typeof window !== 'undefined') {
		const item = window.localStorage.getItem(key)
		try {
			if (item != null) {
				return JSON.parse(item)
			}
		} catch (e) {
			// eslint-disable-next-line
			console.error(e)
		}
	}
	return undefined
}

export default {
	setToLS,
	getFromLS
}
