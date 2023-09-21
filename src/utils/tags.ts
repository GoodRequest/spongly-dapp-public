import { Tags, SportsMap, SportsTagsMap } from '@/typescript/types'

import nbaIcon from '../../public/logos/leagueLogos/nba.svg'
import ncaaIcon from '../../public/logos/leagueLogos/ncaa.webp'
import nflIcon from '../../public/logos/leagueLogos/nfl.webp'
import mblIcon from '../../public/logos/leagueLogos/mlb.svg'
import nhlIcon from '../../public/logos/leagueLogos/nhl.svg'
import ufcIcon from '../../public/logos/leagueLogos/ufc.webp'
import mslIcon from '../../public/logos/leagueLogos/mls.webp'
import elpIcon from '../../public/logos/leagueLogos/EPL.webp'
import Ligue1 from '../../public/logos/leagueLogos/Ligue1.webp'
import bundesLigaIcon from '../../public/logos/leagueLogos/bundesliga.webp'
import laLigaIcon from '../../public/logos/leagueLogos/LaLiga.webp'
import seriea from '../../public/logos/leagueLogos/seriea.webp'
import uclIcon from '../../public/logos/leagueLogos/ucl-white.webp'
import f1Icon from '../../public/logos/leagueLogos/f1.webp'
import motoGpIcon from '../../public/logos/leagueLogos/motogp.webp'

export const MLS_TAG = 9010

export const TAGS_LIST: Tags = [
	{ id: 9001, label: 'NCAA Football', logo: ncaaIcon, country: 'USA', logoClass: 'icon-league league--ncaa' },
	{ id: 9002, label: 'NFL', logo: nflIcon, country: 'USA', logoClass: 'icon-league league--nfl' },
	{ id: 9003, label: 'MLB', logo: mblIcon, country: 'USA', logoClass: 'icon-league league--mlb' },
	{ id: 9004, label: 'NBA', logo: nbaIcon, country: 'USA', logoClass: 'icon-league league--nba' },
	{ id: 9005, label: 'NCAA Basketball', country: 'USA', logoClass: 'icon-league league--ncaa' },
	{ id: 9006, label: 'NHL', logo: nhlIcon, country: 'WORLD', logoClass: 'icon-league league--nhl' },
	{ id: 9007, label: 'UFC', logo: ufcIcon, country: 'WORLD', logoClass: 'icon-league league--ufc' },
	{ id: 9008, label: 'WNBA', country: 'USA', logoClass: 'icon-league league--wnba' },
	{ id: 9010, label: 'MLS', logo: mslIcon, country: 'USA', logoClass: 'icon-league league--mls' },
	{ id: 9011, label: 'EPL', logo: elpIcon, country: 'GB-ENG', logoClass: 'icon-league league--epl' },
	{ id: 9012, label: 'Ligue 1', logo: Ligue1, country: 'FR', logoClass: 'icon-league league--ligue1' },
	{ id: 9013, label: 'Bundesliga', logo: bundesLigaIcon, country: 'DE', logoClass: 'icon-league league--bundesliga' },
	{ id: 9014, label: 'La Liga', logo: laLigaIcon, country: 'ES', logoClass: 'icon-league league--la-liga' },
	{ id: 9015, label: 'Serie A', logo: seriea, country: 'IT', logoClass: 'icon-league league--serie-a' },
	{ id: 9018, label: 'FIFA World Cup', country: 'WORLD', logoClass: 'icon-league league--fifa-world-cup' },
	{ id: 9019, label: 'J1 League', country: 'JP', logoClass: 'icon-league league--j1' },
	{ id: 9100, label: 'Formula 1', logo: f1Icon, country: 'WORLD', logoClass: 'icon-league league--f1' },
	{ id: 9101, label: 'MotoGP', logo: motoGpIcon, country: 'WORLD', logoClass: 'icon-league league--motogp' },
	{ id: 9153, label: 'Grand Slam', country: 'WORLD', logoClass: 'icon-league league--atp' },
	{ id: 9156, label: 'ATP Events', country: 'WORLD', logoClass: 'icon-league league--atp' },
	{ id: 18977, label: 'CS GO', country: 'WORLD', logoClass: 'icon-league league--csgo' },
	{ id: 18983, label: 'DOTA 2', country: 'WORLD', logoClass: 'icon-league league--dota2' },
	{ id: 19138, label: 'LOL', country: 'WORLD', logoClass: 'icon-league league--lol' },
	{ id: 9020, label: 'Indian Premier League', country: 'IN', logoClass: 'icon-league league--ipl' },
	{ id: 9399, label: 'Euroleague', country: 'WORLD', logoClass: 'icon-league league--euroleague' },
	{ id: 9445, label: 'Formula 1', logo: f1Icon, country: 'WORLD', logoClass: 'icon-league league--f1' },
	{ id: 9497, label: 'MotoGP', logo: motoGpIcon, country: 'WORLD', logoClass: 'icon-league league--motogp' },
	{ id: 9153, label: 'Grand Slam', country: 'WORLD', logoClass: 'icon-league league--atp' },
	{ id: 18196, label: 'Boxing', country: 'WORLD', logoClass: 'icon-league league--boxing' },
	{ id: 9057, label: 'Eredivisie', country: 'NL', logoClass: 'icon-league league--eredivisie' },
	{ id: 9061, label: 'Primeira Liga', country: 'PT', logoClass: 'icon-league league--portugal' },
	{ id: 9045, label: 'Copa Libertadores', country: 'WORLD', logoClass: 'icon-league league--copa-libertadores' },
	{ id: 9033, label: 'IIHF World Championship', country: 'WORLD', logoClass: 'icon-league league--iihf' },
	{ id: 9021, label: 'T20 Blast', country: 'GB', logoClass: 'icon-league league--t20' },
	{ id: 109021, label: 'Golf head-to-head', country: 'WORLD', logoClass: 'icon-league league--pga' },
	{ id: 109121, label: 'Golf Tournament Winner', country: 'WORLD', logoClass: 'icon-league league--pga' },
	{ id: 18821, label: 'CONCACAF Nations League', country: 'WORLD', logoClass: 'icon-league league--concacaf-nations' },
	{ id: 9288, label: 'UEFA EURO U21', country: 'WORLD', logoClass: '' },
	{ id: 18806, label: 'UEFA Nations League', country: 'WORLD', logoClass: 'icon-league league--uefa-nations' },
	{ id: 9050, label: 'UEFA EURO Qualifications', country: 'WORLD', logoClass: 'icon-league league--uefa' },
	{ id: 9042, label: 'UEFA Champions League Qualification', country: 'WORLD', logoClass: 'icon-league league--ucl' },
	{ id: 9016, label: 'UEFA Champions League', logo: uclIcon, country: 'WORLD', logoClass: 'icon-league league--ucl' },
	// { id: 9017, label: 'UEFA Europa League', country: 'WORLD', logoClass: 'icon-league league--uel' },
	{ id: 19216, label: 'UEFA Conference League Qualification', country: 'WORLD', logoClass: '' },
	{ id: 9073, label: 'UEFA Europa League', country: 'WORLD', logoClass: 'icon-league league--uel' },
	{ id: 9076, label: 'FIFA World Cup Women', country: 'WORLD', logoClass: '' },
	{ id: 9296, label: 'FIFA World Cup U20', country: 'WORLD', logoClass: 'icon-league league--fifa-world-cup-u20' },
	{ id: 9409, label: 'FIBA World Cup', logoClass: '', country: 'WORLD' },
	{ id: 9536, label: 'Saudi Professional League', logoClass: '', country: 'SA' },
	{ id: 9268, label: 'Serie A', logoClass: '', country: 'BR' }
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
	9017: 'Soccer',
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
	9296: 'Soccer',
	9021: 'Cricket',
	9050: 'Soccer',
	109021: 'Golf',
	109121: 'Golf',
	18806: 'Soccer',
	18821: 'Soccer',
	9288: 'Soccer',
	9042: 'Soccer',
	19216: 'Soccer',
	9076: 'Soccer',
	9073: 'Soccer',
	9409: 'Basketball',
	9536: 'Soccer',
	9268: 'Soccer'
}

export const ENETPULSE_SPORTS = [
	9153, 9156, 18977, 18983, 19138, 9399, 18196, 9057, 9061, 9045, 9445, 9033, 9296, 9050, 9497, 18806, 18821, 9288, 9042, 19216, 9076, 9073, 9409, 9536, 9268
]

export const JSON_ODDS_SPORTS = [109021, 109121]
export const FIFA_WC_TAG = 9018
export const FIFA_WC_U20_TAG = 9296
export const IIHF_WC_TAG = 9033
export const UEFA_TAGS = [9016, 9017, 18806, 18821, 9288, 9042, 19216, 9076]
export const MOTOSPORT_TAGS = [9445, 9497]
export const GOLF_TAGS = [109021, 109121]
export const GOLF_TOURNAMENT_WINNER_TAG = 109121

export const SPORTS_TAGS_MAP: SportsTagsMap = {
	Football: [9001, 9002],
	Baseball: [9003],
	Basketball: [9004, 9005, 9008, 9399, 9409],
	Hockey: [9006, 9033],
	Soccer: [9010, 9011, 9012, 9013, 9014, 9015, 9016, 9017, 9018, 9019, 9057, 9061, 9045, 9296, 9050, 18806, 18821, 9288, 9042, 19216, 9076, 9073, 9536, 9268],
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
	UEFA_EL = 9017,
	J1_LEAGUE = 9019,
	FORMULA1 = 9100,
	MOTOGP = 9101,
	CSGO = 18977,
	DOTA2 = 18983,
	LOL = 19138,
	IPL = 9020,
	EUROLEAGUE = 9399
}
