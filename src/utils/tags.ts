import { Tags, SportsMap, SportsTagsMap } from '@/typescript/types'

import nbaIcon from '../../public/logos/leagueLogos/nba.svg'
import ncaaIcon from '../../public/logos/leagueLogos/ncaa.webp'
import nflIcon from '../../public/logos/leagueLogos/nfl.webp'
import mlbIcon from '../../public/logos/leagueLogos/mlb.svg'
import nhlIcon from '../../public/logos/leagueLogos/nhl.svg'
import ufcIcon from '../../public/logos/leagueLogos/ufc.webp'
import mlsIcon from '../../public/logos/leagueLogos/mls.webp'
import eplIcon from '../../public/logos/leagueLogos/EPL.webp'
import ligue1 from '../../public/logos/leagueLogos/Ligue1.webp'
import bundesLigaIcon from '../../public/logos/leagueLogos/bundesliga.webp'
import laLigaIcon from '../../public/logos/leagueLogos/LaLiga.webp'
import seriea from '../../public/logos/leagueLogos/seriea.webp'
import uclIcon from '../../public/logos/leagueLogos/ucl-white.webp'
// import f1Icon from '../../public/logos/leagueLogos/f1.webp'
// import motoGpIcon from '../../public/logos/leagueLogos/motogp.webp'

export const MLS_TAG = 9010

export const TAGS_LIST: Tags = [
	{
		id: 9001,
		country: 'USA',
		label: 'NCAA Football',
		logo: ncaaIcon,
		logoClass: 'icon-league league--ncaa',
		favourite: false,
		hidden: false,
		priority: 202
	},
	{
		id: 9002,
		country: 'USA',
		label: 'NFL',
		logo: nflIcon,
		logoClass: 'icon-league league--nfl',
		favourite: false,
		hidden: false,
		priority: 201
	},
	{
		id: 9003,
		country: 'USA',
		label: 'MLB',
		logo: mlbIcon,
		logoClass: 'icon-league league--mlb',
		favourite: false,
		hidden: false,
		priority: 401
	},
	{
		id: 9004,
		country: 'USA',
		label: 'NBA',
		logo: nbaIcon,
		logoClass: 'icon-league league--nba',
		favourite: false,
		hidden: false,
		priority: 301
	},
	{
		id: 9005,
		country: 'USA',
		label: 'NCAA Basketball',
		logo: ncaaIcon,
		logoClass: 'icon-league league--ncaa',
		favourite: false,
		hidden: false,
		priority: 302
	},
	{
		id: 9006,
		label: 'NHL',
		country: 'USA',
		logo: nhlIcon,
		logoClass: 'icon-league league--nhl',
		favourite: false,
		hidden: false,
		priority: 501
	},
	{
		id: 9007,
		label: 'UFC',
		country: 'WORLD',
		logo: ufcIcon,
		logoClass: 'icon-league league--ufc',
		favourite: false,
		hidden: false,
		priority: 601
	},
	{ id: 9008, label: 'WNBA', country: 'USA', logoClass: 'icon-league league--wnba', favourite: false, hidden: false, priority: 304 },
	{
		id: 9010,
		label: 'MLS',
		country: 'USA',
		logo: mlsIcon,
		logoClass: 'icon-league league--mls',
		favourite: false,
		hidden: false,
		priority: 106
	},
	{
		id: 9011,
		country: 'GB-ENG',
		label: 'EPL',
		logo: eplIcon,
		logoClass: 'icon-league league--epl',
		favourite: false,
		hidden: false,
		priority: 101
	},
	{
		id: 9012,
		country: 'FR',
		label: 'Ligue 1',
		logo: ligue1,
		logoClass: 'icon-league league--ligue1',
		favourite: false,
		hidden: false,
		priority: 105
	},
	{
		id: 9013,
		country: 'DE',
		label: 'Bundesliga',
		logo: bundesLigaIcon,
		logoClass: 'icon-league league--bundesliga',
		favourite: false,
		hidden: false,
		priority: 104
	},
	{
		id: 9014,
		country: 'ES',
		label: 'La Liga',
		logo: laLigaIcon,
		logoClass: 'icon-league league--la-liga',
		favourite: false,
		hidden: false,
		priority: 102
	},
	{
		id: 9015,
		country: 'IT',
		label: 'Serie A',
		logo: seriea,
		logoClass: 'icon-league league--serie-a',
		favourite: false,
		hidden: false,
		priority: 103
	},
	{
		id: 9016,
		country: 'WORLD',
		label: 'UEFA Champions League',
		logo: uclIcon,
		logoClass: 'icon-league league--ucl',
		favourite: false,
		hidden: false,
		priority: 110
	},
	{
		id: 9017,
		country: 'WORLD',
		label: 'UEFA Europa League',
		logo: ``,
		logoClass: 'icon-league league--uel',
		favourite: false,
		hidden: false,
		priority: 111
	},
	{
		id: 9018,
		country: 'WORLD',
		label: 'FIFA World Cup',
		logo: ``,
		logoClass: 'icon-league league--fifa-world-cup',
		favourite: false,
		hidden: true,
		priority: 0
	},
	{
		id: 9019,
		country: 'JP',
		label: 'J1 League',
		logo: ``,
		logoClass: 'icon-league league--j1',
		favourite: false,
		hidden: false,
		priority: 109
	},
	// {
	//     id: 9445,
	//     label: 'Formula 1',
	//     logo: '/logos/leagueLogos/f1.png',
	//     logoClass: 'icon-league league--f1',
	//     favourite: false,
	//     hidden: false,
	//     priority: 701,
	// },
	// {
	//     id: 9497,
	//     label: 'MotoGP',
	//     logo: `/logos/leagueLogos/motogp.png`,
	//     logoClass: 'icon-league league--motogp',
	//     favourite: false,
	//     hidden: false,
	//     priority: 702,
	// },
	{
		id: 9153,
		country: 'WORLD',
		label: 'Grand Slam',
		logo: '',
		logoClass: 'icon-league league--atp',
		favourite: false,
		hidden: false,
		priority: 602
	},
	{
		id: 9156,
		country: 'WORLD',
		label: 'ATP Events',
		logo: ``,
		logoClass: 'icon-league league--atp',
		favourite: false,
		hidden: false,
		priority: 603
	},
	{
		id: 18977,
		country: 'WORLD',
		label: 'CS GO',
		logoClass: 'icon-league league--csgo',
		favourite: false,
		hidden: false,
		priority: 801
	},
	{
		id: 18983,
		country: 'WORLD',
		label: 'DOTA 2',
		logoClass: 'icon-league league--dota2',
		favourite: false,
		hidden: false,
		priority: 802
	},
	{
		id: 19138,
		country: 'WORLD',
		label: 'LOL',
		logoClass: 'icon-league league--lol',
		favourite: false,
		hidden: false,
		priority: 803
	},
	{
		id: 9020,
		country: 'IN',
		label: 'Indian Premier League',
		logoClass: 'icon-league league--ipl',
		favourite: false,
		hidden: false,
		priority: 901
	},
	{
		id: 9399,
		country: 'WORLD',
		label: 'Euroleague',
		logoClass: 'icon-league league--euroleague',
		favourite: false,
		hidden: false,
		priority: 303
	},
	{
		id: 18196,
		country: 'WORLD',
		label: 'Boxing',
		logoClass: 'icon-league league--boxing',
		favourite: false,
		hidden: false,
		priority: 602
	},
	{
		id: 9057,
		country: 'NL',
		label: 'Eredivisie',
		logoClass: 'icon-league league--eredivisie',
		favourite: false,
		hidden: false,
		priority: 107
	},
	{
		id: 9061,
		country: 'PT',
		label: 'Primeira Liga',
		logoClass: 'icon-league league--portugal',
		favourite: false,
		hidden: false,
		priority: 108
	},
	{
		id: 9045,
		country: 'WORLD',
		label: 'Copa Libertadores',
		logoClass: 'icon-league league--copa-libertadores',
		favourite: false,
		hidden: false,
		priority: 112
	},
	{
		id: 9033,
		country: 'WORLD',
		label: 'IIHF World Championship',
		logoClass: 'icon-league league--iihf',
		favourite: false,
		hidden: false,
		priority: 502
	},
	{
		id: 9296,
		country: 'WORLD',
		label: 'FIFA World Cup U20',
		logoClass: 'icon-league league--fifa-world-cup-u20',
		favourite: false,
		hidden: false,
		priority: 121
	},
	{
		id: 9021,
		country: 'WORLD',
		label: 'T20 Blast',
		logoClass: 'icon-league league--t20',
		favourite: false,
		hidden: false,
		priority: 902
	},
	{
		id: 9050,
		country: 'WORLD',
		label: 'UEFA EURO Qualifications',
		logoClass: 'icon-league league--uefa',
		favourite: false,
		hidden: false,
		priority: 113
	},
	{
		id: 109021,
		country: 'WORLD',
		label: 'Golf head-to-head',
		logoClass: 'icon-league league--pga',
		favourite: false,
		hidden: false,
		priority: 1001
	},
	{
		id: 109121,
		country: 'WORLD',
		label: 'Golf Tournament Winner',
		logoClass: 'icon-league league--pga',
		favourite: false,
		hidden: false,
		priority: 1002
	},
	{
		id: 18806,
		country: 'WORLD',
		label: 'UEFA Nations League',
		logoClass: 'icon-league league--uefa-nations',
		favourite: false,
		hidden: false,
		priority: 114
	},
	{
		id: 18821,
		country: 'WORLD',
		label: 'CONCACAF Nations League',
		logoClass: 'icon-league league--concacaf-nations',
		favourite: false,
		hidden: false,
		priority: 115
	},
	{
		id: 9288,
		country: 'WORLD',
		label: 'UEFA EURO U21',
		logoClass: '',
		favourite: false,
		hidden: false,
		priority: 120
	},
	{
		id: 9042,
		country: 'WORLD',
		label: 'UEFA Champions League Qualification',
		logoClass: 'icon-league league--ucl',
		favourite: false,
		hidden: false,
		priority: 111
	},
	{
		id: 19216,
		country: 'WORLD',
		label: 'UEFA Conference League',
		logoClass: '',
		favourite: false,
		hidden: false,
		priority: 118
	},
	{
		id: 9076,
		country: 'WORLD',
		label: 'FIFA World Cup Women',
		logoClass: '',
		favourite: false,
		hidden: false,
		priority: 119
	},
	{
		id: 9073,
		country: 'WORLD',
		label: 'UEFA Europa League',
		logoClass: 'icon-league league--uel',
		favourite: false,
		hidden: true,
		priority: 117
	},
	{
		id: 9409,
		country: 'WORLD',
		label: 'FIBA World Cup',
		logoClass: '',
		favourite: false,
		hidden: false,
		priority: 303
	},
	{
		id: 9536,
		country: 'SA',
		label: 'Saudi Professional League',
		logoClass: '',
		favourite: false,
		hidden: false,
		priority: 109
	},
	{
		id: 9268,
		country: 'BR',
		label: 'Serie A',
		logoClass: '',
		favourite: false,
		hidden: false,
		priority: 109
	},
	{
		id: 19199,
		country: 'WORLD',
		label: 'CONMEBOL WC Qualification',
		logoClass: '',
		favourite: false,
		hidden: false,
		priority: 110
	}
]

export enum BetType {
	WINNER = 0,
	SPREAD = 10001,
	TOTAL = 10002,
	DOUBLE_CHANCE = 10003
}

export const BetTypeNameMap: Record<BetType, string> = {
	[BetType.WINNER]: 'winner',
	[BetType.SPREAD]: 'spread',
	[BetType.TOTAL]: 'total',
	[BetType.DOUBLE_CHANCE]: 'double-chance'
}

export enum DoubleChanceMarketType {
	HOME_TEAM_NOT_TO_LOSE = 'HomeTeamNotToLose',
	NO_DRAW = 'NoDraw',
	AWAY_TEAM_NOT_TO_LOSE = 'AwayTeamNotToLose'
}

export const SPORTS_MAP: SportsMap = {
	9001: 'Football',
	9002: 'Football',
	9003: 'Baseball',
	9004: 'Basketball',
	9005: 'Basketball',
	9006: 'Hockey',
	9007: 'MMA',
	9008: 'Basketball',
	9010: 'Soccer',
	9011: 'Soccer',
	9012: 'Soccer',
	9013: 'Soccer',
	9014: 'Soccer',
	9015: 'Soccer',
	9016: 'Soccer',
	9018: 'Soccer',
	9019: 'Soccer',
	9445: 'Motosport',
	9497: 'Motosport',
	9153: 'Tennis',
	9156: 'Tennis',
	18977: 'eSports',
	18983: 'eSports',
	19138: 'eSports',
	9020: 'Cricket',
	9399: 'Basketball',
	18196: 'MMA',
	9057: 'Soccer',
	9061: 'Soccer',
	9045: 'Soccer',
	9033: 'Hockey',
	9021: 'Cricket',
	9050: 'Soccer',
	109021: 'Golf',
	109121: 'Golf',
	18806: 'Soccer',
	18821: 'Soccer',
	// 9288: 'Soccer',
	// 9042: 'Soccer',
	// 19216: 'Soccer',
	// 9296: 'Soccer',
	// 9017: 'Soccer',
	9076: 'Soccer',
	9073: 'Soccer',
	9409: 'Basketball',
	9536: 'Soccer',
	9268: 'Soccer'
}

export const ENETPULSE_SPORTS = [
	9153, 9156, 18977, 18983, 19138, 9399, 18196, 9057, 9061, 9045, 9445, 9033, 9050, 9497, 18806, 18821, 9268, 9076, 9073, 9409,
	9536 /* 9288,  9042, 9296, 19216 */
]

export const JSON_ODDS_SPORTS = [109021, 109121]
export const FIFA_WC_TAG = 9018
export const IIHF_WC_TAG = 9033
export const UEFA_TAGS = [9016, 18806, 18821, 9076 /* , 9288 , 9042, 9017, 19216 */]
export const MOTOSPORT_TAGS = [9445, 9497]
export const GOLF_TAGS = [109021, 109121]
export const GOLF_TOURNAMENT_WINNER_TAG = 109121

export const SPORTS_TAGS_MAP: SportsTagsMap = {
	Football: [9001, 9002],
	Baseball: [9003],
	Basketball: [9004, 9005, 9008, 9399, 9409],
	Hockey: [9006, 9033],
	Soccer: [
		9010, 9011, 9012, 9013, 9014, 9015, 9016, 9018, 9019, 9057, 9061, 9045, 9050, 18806, 18821, 9076, 9073, 9536, 9268 /* , 9296, 9017, 9288, 9042, 19216 */
	],
	MMA: [9007, 18196],
	Motosport: [9445, 9497],
	Tennis: [9153, 9156],
	eSports: [18977, 18983, 19138],
	Cricket: [9020, 9021],
	Golf: [109021, 109121]
}

export enum TAGS_FLAGS {
	NCAA_FOOTBALL = 9001,
	NFL = 9002,
	MLB = 9003,
	NBA = 9004,
	NCAA_BASKETBALL = 9005,
	NHL = 9006,
	MMA = 9007,
	WNBA = 9008,
	MLS = 9010,
	EPL = 9011,
	LIGUE_ONE = 9012,
	BUNDESLIGA = 9013,
	LA_LIGA = 9014,
	SERIE_A = 9015,
	UEFA_CL = 9016,
	UEFA_EL = 9073,
	// UEFA_EL = 9017,
	J1_LEAGUE = 9019,
	FORMULA1 = 9100,
	MOTOGP = 9101,
	CSGO = 18977,
	DOTA2 = 18983,
	LOL = 19138,
	IPL = 9020,
	EUROLEAGUE = 9399
}
