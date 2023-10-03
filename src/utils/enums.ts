export enum PAGES {
	HOMEPAGE = 'homepage',
	DASHBOARD = 'dashboard',
	TICKETS = 'tickets',
	MATCHES = 'matches',
	MY_WALLET = 'my-wallet',
	PARLAY_LEADERBOARD = 'parlay-leaderboard'
}

export enum MATCHES {
	OPEN = 'open',
	ONGOING = 'ongoing',
	FINISHED = 'finished',
	PAUSED = 'paused'
}

export enum WALLET_TICKETS {
	ALL = 'ALL',
	SUCCESSFUL = 'SUCCESSFUL',
	MISSED = 'MISSED',
	ONGOING = 'ONGOING',
	OPEN_TICKETS = 'OPENTICKETS',
	PAUSED_CANCELED = 'PAUSEDCANCELED'
}

export const LIST_TYPE = {
	TICKETS: 'TICKETS',
	MATCHES: 'MATCHES'
}

export const FORM = {
	BET_TICKET: 'BET_TICKET'
}

export enum ODDS_PROPERTY {
	HOME = 'homeOdds',
	AWAY = 'awayOdds',
	DRAW = 'drawOdds'
}

export enum BONUS_PROPERTY {
	HOME = 'homeBonus',
	AWAY = 'awayBonus',
	DRAW = 'drawBonus'
}

export enum COMBINED_BET_OPTIONS {
	COMBINED_WINNER_AND_TOTAL_HOME_OVER = '1&O',
	COMBINED_WINNER_AND_TOTAL_HOME_UNDER = '1&U',
	COMBINED_WINNER_AND_TOTAL_AWAY_OVER = '2&O',
	COMBINED_WINNER_AND_TOTAL_AWAY_UNDER = '2&U'
}

export enum BET_OPTIONS {
	WINNER_HOME = '1',
	WINNER_AWAY = '2',
	WINNER_DRAW = 'X',
	HANDICAP_HOME = 'H1',
	HANDICAP_AWAY = 'H2',
	TOTAL_OVER = 'O',
	TOTAL_UNDER = 'U',
	DOUBLE_CHANCE_HOME = '1X',
	DOUBLE_CHANCE_AWAY = 'X2',
	DOUBLE_CHANCE_DRAW = '12',
	COMBINED_WINNER_AND_TOTAL_HOME_OVER = '1&O',
	COMBINED_WINNER_AND_TOTAL_HOME_UNDER = '1&U',
	COMBINED_WINNER_AND_TOTAL_AWAY_OVER = '2&O',
	COMBINED_WINNER_AND_TOTAL_AWAY_UNDER = '2&U'
}

export enum DoubleChanceMarketType {
	HOME_TEAM_NOT_TO_LOSE = 'HomeTeamNotToLose',
	NO_DRAW = 'NoDraw',
	AWAY_TEAM_NOT_TO_LOSE = 'AwayTeamNotToLose'
}

export enum RESOLUTIONS {
	SX = 'SX',
	SMSX = 'SMSX',
	SM = 'SM',
	MD = 'MD',
	LG = 'LG',
	XL = 'XL',
	SEMIXXL = 'SEMIXXL',
	XXL = 'XXL'
}

export enum MARKET_PROPERTY {
	POSITION = 'position',
	POSITIONS = 'positions',
	WON = 'won',
	CLAIMED = 'claimed',
	LAST_GAME_STARTS = 'lastGameStarts'
}

export enum RESULT_TYPE {
	WINNER = '1',
	LOOSER = '0'
}

export enum ContractSGPOrder {
	MONEYLINETOTALS = 0,
	MONEYLINESPREAD = 1,
	SPREADTOTALS = 2
}

export enum SCROLL_DIRECTION {
	RIGHT = 'right',
	LEFT = 'left'
}
