import { useEffect, useState } from 'react'
import { breakpoints } from '@/styles/theme'
import { RESOLUTIONS } from '@/utils/enums'

export const useMedia = () => {
	let mediaQueryLists: any
	// NOTE: Leaving these contants here to make it easier to customize.
	const queries = [
		`(max-width: ${breakpoints.sm}px)`,
		`(max-width: ${breakpoints.md}px)`,
		`(max-width: ${breakpoints.lg}px)`,
		`(max-width: ${breakpoints.xl}px)`,
		`(max-width: ${breakpoints.semixxl}px)`
	]

	const values = [RESOLUTIONS.SM, RESOLUTIONS.MD, RESOLUTIONS.LG, RESOLUTIONS.XL, RESOLUTIONS.SEMIXXL]
	const defaultValue = RESOLUTIONS.XXL

	// Array containing a media query list for each query
	if (typeof window !== 'undefined') {
		mediaQueryLists = queries.map((q) => window.matchMedia(q))
	}

	// Function that gets value based on matching media query
	const getValue = () => {
		// Get index of first media query that matches
		const index = mediaQueryLists?.findIndex((mql: any) => mql.matches)
		// Return related value or defaultValue if none
		return typeof values[index] !== 'undefined' ? values[index] : defaultValue
	}
	// State and setter for matched value
	const [value, setValue] = useState(getValue)
	useEffect(
		() => {
			// Event listener callback
			// Note: By defining getValue outside of useEffect we ensure that it has ...
			// ... current values of hook args (as this hook callback is created once on mount).
			const handler = () => setValue(getValue)
			// Set a listener for each media query with above handler as callback.
			mediaQueryLists?.forEach((mql: any) => mql.addEventListener('change', handler))
			// Remove listeners on cleanup
			return () => mediaQueryLists?.forEach((mql: any) => mql.removeEventListener('change', handler))
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[] // Empty array ensures effect is only run on mount and unmount
	)
	return value
}
