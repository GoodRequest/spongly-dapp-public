import { DefaultTheme } from 'styled-components'
import darkTokens from '@/styles/darkTokens'
import { CustomTheme } from '@/typescript/styled'

export const breakpoints = {
	xs: 320,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	semixxl: 1400,
	xxl: 1600
}

const customTheme: CustomTheme = {
	spacing: {
		2: '2px',
		4: '4px',
		6: '6px',
		8: '8px',
		12: '12px',
		16: '16px',
		20: '20px',
		24: '24px',
		32: '32px',
		40: '40px',
		48: '48px',
		64: '64px',
		80: '80px',
		96: '96px',
		128: '128px',
		160: '160px',
		192: '192px',
		224: '224px',
		2564: '256px'
	},
	borderRadius: {
		2: '2px',
		4: '4px',
		6: '6px',
		8: '8px',
		12: '12px',
		16: '16px',
		20: '20px',
		24: '24px',
		32: '32px',
		40: '40px',
		48: '48px',
		80: '80px',
		circle: '50%'
	},
	borderWidth: {
		xs: '1px',
		sm: '1.5px',
		md: '2px',
		lg: '4px'
	}
}

export const theme: DefaultTheme = { ...darkTokens, ...customTheme }
