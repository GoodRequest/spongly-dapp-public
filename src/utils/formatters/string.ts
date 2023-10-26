import dayjs from 'dayjs'
import { toNumber } from 'lodash'

export const truncateAddress = (address: string, first = 5, last = 5) =>
	address ? `${address.slice(0, first)}...${address.slice(-last, address.length)}` : null

export const truncateText = (text: string, maxLength: number) => (text.length > maxLength ? `${text.substring(0, maxLength)}...` : text)

export const fixDuplicatedTeamName = (name: string) => {
	if (!name?.length) return ''
	const middle = Math.floor(name.length / 2)
	const firstHalf = name.substring(0, middle).trim()
	const secondHalf = name.substring(middle, name.length).trim()

	if (firstHalf === secondHalf) {
		return firstHalf
	}

	const splittedName = name.split(' ')
	const uniqueWordsInName = new Set(splittedName)
	if (uniqueWordsInName.size !== splittedName.length) {
		return Array.from(uniqueWordsInName).join(' ')
	}

	return name
}

export const fixEnetpulseRacingName = (team: string) => (team !== null ? team.slice(0, team.length - 4).trim() : '')

export const fixOneSideMarketCompetitorName = (team: string) => {
	return team.endsWith('YES') ? (team !== null ? team.slice(0, team.length - 4).trim() : '') : team
}

export const getFormatDate = (type: string, date: any) => {
	return dayjs(toNumber(date) * 1000).format('MMM DD, YYYY | HH:mm')
}

export const formatAddress = (address: string | undefined) => {
	if (!address) return ''

	return `${address?.slice(0, 3)}...${address?.slice(-3)}`
}

export const formatAccount = (account: string) => {
	return account.slice(0, 3).concat('...').concat(account.slice(-3))
}
