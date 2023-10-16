/* eslint-disable no-nested-ternary */
import { TAGS_LIST } from './tags'
import { fixOneSideMarketCompetitorName } from './formatters/string'
import { hashStringToNumber } from './helpers'

import WalletLogo0 from '@/assets/icons/walletIcons/1.png'
import WalletLogo1 from '@/assets/icons/walletIcons/2.png'
import WalletLogo2 from '@/assets/icons/walletIcons/3.png'
import WalletLogo3 from '@/assets/icons/walletIcons/4.png'
import WalletLogo4 from '@/assets/icons/walletIcons/5.png'
import WalletLogo5 from '@/assets/icons/walletIcons/6.png'
import WalletLogo6 from '@/assets/icons/walletIcons/7.png'
import WalletLogo7 from '@/assets/icons/walletIcons/8.png'
import WalletLogo8 from '@/assets/icons/walletIcons/9.png'
import WalletLogo9 from '@/assets/icons/walletIcons/10.png'

export const getTeamImageSource = (team: string, leagueTag: number) => {
	let imagePath
	if (
		leagueTag === 9005 ||
		leagueTag === 9010 ||
		leagueTag === 9012 ||
		leagueTag === 9015 ||
		leagueTag === 9014 ||
		leagueTag === 9007 ||
		leagueTag === 9016 ||
		leagueTag === 9100 ||
		leagueTag === 9001 ||
		leagueTag === 9017 ||
		leagueTag === 9018 ||
		leagueTag === 18977 ||
		leagueTag === 18983 ||
		leagueTag === 19138 ||
		leagueTag === 9020 ||
		leagueTag === 9399 ||
		leagueTag === 18196 ||
		leagueTag === 9057 ||
		leagueTag === 9061 ||
		leagueTag === 9045 ||
		leagueTag === 9296 ||
		leagueTag === 9021 ||
		leagueTag === 9050 ||
		leagueTag === 18806 ||
		leagueTag === 18821 ||
		leagueTag === 9288 ||
		leagueTag === 9042 ||
		leagueTag === 9076 ||
		leagueTag === 19216 ||
		leagueTag === 9536
	) {
		imagePath = `/logos/${TAGS_LIST.find((t: any) => t.id === leagueTag)?.label}/${team.trim().replaceAll(' ', '-').toLowerCase()}.webp`
	} else if (leagueTag === 9153 || leagueTag === 9156) {
		imagePath = `/logos/Tennis/${team.trim().replaceAll(' ', '-').toLowerCase()}.webp`
	} else if (leagueTag === 9445 || leagueTag === 9497) {
		imagePath = `/logos/${TAGS_LIST.find((t) => t.id === leagueTag)?.label}/${fixOneSideMarketCompetitorName(team).replaceAll(' ', '-').toLowerCase()}.webp`
	} else if (leagueTag === 109021) {
		imagePath = `/logos/PGA/${team.trim().replaceAll(' ', '-').toLowerCase()}.webp`
	} else if (leagueTag === 109121) {
		imagePath = `/logos/PGA/${fixOneSideMarketCompetitorName(team).replaceAll(' ', '-').toLowerCase()}.webp`
	} else {
		imagePath = `/logos/${TAGS_LIST.find((t) => t.id === leagueTag)?.label}/${team.trim().replaceAll(' ', '-').toLowerCase()}.svg`
	}

	return imagePath
}
export const getWalletImage = (walletName: string) => {
	const waletHashModulo: number = Math.abs(hashStringToNumber(walletName || '') % 12)

	// TODO: coral images from design
	switch (waletHashModulo) {
		case 0:
			return WalletLogo0
		case 1:
			return WalletLogo1
		case 2:
			return WalletLogo2
		case 3:
			return WalletLogo3
		case 4:
			return WalletLogo4
		case 5:
			return WalletLogo5
		case 6:
			return WalletLogo6
		case 7:
			return WalletLogo7
		case 8:
			return WalletLogo8
		case 9:
			return WalletLogo9
		case 10:
			return WalletLogo9
		case 11:
			return WalletLogo9
		default:
			return WalletLogo0
	}
}
