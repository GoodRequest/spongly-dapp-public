import { useEffect, useState } from 'react'

// NOTE: Wagmi wallet hooks needs to be checked before render
export function useIsMounted() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	return mounted
}
