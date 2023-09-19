import { FC, useMemo, Dispatch, SetStateAction } from 'react'
import { includes, toNumber } from 'lodash'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'

// components
import OddButton from '@/components/oddButton/OddButton'
import OddValue from '@/components/oddButton/OddValue'

// utils
import { BET_OPTIONS, MATCHES } from '@/utils/enums'
import { NETWORK_IDS, NO_TEAM_IMAGE_FALLBACK, SportFilterEnum, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { BetType, SPORTS_MAP } from '@/utils/tags'
import { getTeamImageSource } from '@/utils/images'
import { getOddByBetType } from '@/utils/helpers'
import { roundToTwoDecimals } from '@/utils/formatters/number'
import { getFormatDate } from '@/utils/formatters/string'

// icons
import PauseIcon from '@/assets/icons/pause.svg'
import ClockIcon from '@/assets/icons/clock.svg'

// redux
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'

// styles
import * as SC from './MatchesListStyles'
import * as SCS from '@/styles/GlobalStyles'

interface IMatchListItem {
	match: TicketPosition
	type: MATCHES
	setVisibleTotalWinnerModal: Dispatch<SetStateAction<boolean>>
}

const MatchListHeader: FC<IMatchListItem> = ({ match, type = MATCHES.OPEN, setVisibleTotalWinnerModal }) => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const { winnerTypeMatch, doubleChanceTypeMatches, spreadTypeMatch, totalTypeMatch } = match
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(winnerTypeMatch?.tags[0] as any)
	const isOnlyWinner = winnerTypeMatch && doubleChanceTypeMatches?.length === 0 && !spreadTypeMatch && !totalTypeMatch

	const formatFinishedResults = () => {
		if (isTotalWinner) {
			if (match.winnerTypeMatch?.homeScore === '1') {
				return t('Winner')
			}
			return t('No win')
		}
		return `${match.homeScore || '?'} : ${match.awayScore || '?'}`
	}

	const images = useMemo(
		() => (
			<>
				<SC.TeamImage>
					<img
						src={getTeamImageSource(match?.homeTeam || '', toNumber(match?.tags?.[0]))}
						onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
							e.target.src = NO_TEAM_IMAGE_FALLBACK
						}}
					/>
				</SC.TeamImage>
				{!isTotalWinner && (
					<SC.TeamImage>
						<img
							src={getTeamImageSource(match?.awayTeam || '', toNumber(match?.tags?.[0]))}
							onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
								e.target.src = NO_TEAM_IMAGE_FALLBACK
							}}
						/>
					</SC.TeamImage>
				)}
			</>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[match]
	)

	const teamNames = useMemo(
		() => (
			<>
				<SCS.EllipsisText
					ellipsis={{
						rows: 1
					}}
					title={match.homeTeam}
				>
					{match.homeTeam}
				</SCS.EllipsisText>
				{!isTotalWinner && (
					<SCS.EllipsisText
						ellipsis={{
							rows: 1
						}}
						title={match.awayTeam}
					>
						{match.awayTeam}
					</SCS.EllipsisText>
				)}
			</>
		),
		[match, isTotalWinner]
	)

	const getContestedTeams = useMemo(
		() => (
			<SC.Contest>
				<SC.Header>{getFormatDate(type, match.maturityDate, t)}</SC.Header>
				<SC.XXLWrapper>
					<SC.NoWrapCenterRow gutter={16}>
						<Col span={isOnlyWinner || isTotalWinner || type !== MATCHES.OPEN ? 5 : 12}>
							<Row style={{ flexWrap: 'nowrap' }}>{images}</Row>
						</Col>
						<Col span={isOnlyWinner || isTotalWinner || type !== MATCHES.OPEN ? 19 : 12}>{teamNames}</Col>
					</SC.NoWrapCenterRow>
				</SC.XXLWrapper>
				<SC.SEMIXXLWrapper>
					<Row>{images}</Row>
					<Row>
						<SC.MobileTeamsContent>{teamNames}</SC.MobileTeamsContent>
					</Row>
				</SC.SEMIXXLWrapper>
				<SC.MDWrapper>
					<Row gutter={16}>
						<SC.FlexCol isTotalWinner={isTotalWinner}>{images}</SC.FlexCol>
						<SC.FlexCenterCol>{teamNames}</SC.FlexCenterCol>
					</Row>
				</SC.MDWrapper>
			</SC.Contest>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[match]
	)

	const getBaseBetTypes = () => {
		switch (SPORTS_MAP[Number(match.tags?.[0])]) {
			case SportFilterEnum.Soccer:
				return [BetType.WINNER, BetType.DOUBLE_CHANCE]
			case SportFilterEnum.Football:
				return [BetType.WINNER, BetType.DOUBLE_CHANCE, BetType.SPREAD, BetType.TOTAL]
			case SportFilterEnum.Basketball:
				return [BetType.WINNER, BetType.SPREAD, BetType.TOTAL]
			case SportFilterEnum.Baseball:
				return [BetType.WINNER, BetType.SPREAD, BetType.TOTAL]
			case SportFilterEnum.Hockey:
				return [BetType.WINNER, BetType.SPREAD, BetType.TOTAL]
			case SportFilterEnum.MMA:
				return [BetType.WINNER]
			case SportFilterEnum.Tennis:
				return [BetType.WINNER, BetType.SPREAD, BetType.TOTAL]
			case SportFilterEnum.eSports:
				return [BetType.WINNER]
			case SportFilterEnum.Cricket:
				return [BetType.WINNER]
			default:
				return [BetType.WINNER, BetType.DOUBLE_CHANCE]
		}
	}
	const getPushNumber = () => {
		if (isTotalWinner) return 10
		if (isOnlyWinner) return 10
		return 0
	}
	const getSpanNumber = (betType: BetType) => {
		if (isOnlyWinner) return 5
		if (getBaseBetTypes().length > 2) {
			if (betType === BetType.WINNER && match.drawOdds && Number(match.drawOdds) !== 0) return 7
			return 5
		}
		if (getBaseBetTypes().length === 2) return 8
		return 16
	}

	const handleOnClickRow = () => {
		// TODO: route by match id
		// router.push(`/matches/${1}`)
	}

	return (
		<>
			<SC.MobileContentWrapper>
				<SC.MatchItemRow key={`${match.maturityDate}-${MATCHES.OPEN}`} onClick={handleOnClickRow}>
					<SC.MatchItemCol $alignItems={'flex-start'} span={24}>
						{getContestedTeams}
					</SC.MatchItemCol>
				</SC.MatchItemRow>
				{type === MATCHES.OPEN && includes(getBaseBetTypes(), BetType.WINNER) && (
					<>
						<SC.MobileDivider />
						<SC.RadioMobileHeader>{t('Winner')}</SC.RadioMobileHeader>
						<SC.RadioMobileGroup>
							<OddButton
								isHeader
								match={match}
								setVisibleTotalWinnerModal={isTotalWinner ? setVisibleTotalWinnerModal : undefined}
								betOption={BET_OPTIONS.WINNER_HOME}
								oddName={isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_HOME}
								isMobilePanel
							/>
							<OddButton isHeader match={match} betOption={BET_OPTIONS.WINNER_DRAW} isMobilePanel />
							<OddButton isHeader match={match} betOption={BET_OPTIONS.WINNER_AWAY} isMobilePanel />
						</SC.RadioMobileGroup>
						<SC.OddsWrapper>
							<OddValue match={match} betOption={BET_OPTIONS.WINNER_HOME} />
							<OddValue match={match} betOption={BET_OPTIONS.WINNER_DRAW} />
							<OddValue match={match} betOption={BET_OPTIONS.WINNER_AWAY} />
						</SC.OddsWrapper>
					</>
				)}
				{type === MATCHES.ONGOING && <SC.MobileStatusWrapper type={MATCHES.ONGOING}>{t('ONGOING')}</SC.MobileStatusWrapper>}
				{type === MATCHES.FINISHED && <SC.MobileStatusWrapper type={MATCHES.FINISHED}>{formatFinishedResults()}</SC.MobileStatusWrapper>}
				{type === MATCHES.PAUSED && <SC.MobileStatusWrapper type={MATCHES.FINISHED}>{t('PAUSED')}</SC.MobileStatusWrapper>}
			</SC.MobileContentWrapper>
			<SC.PCContentWrapper>
				{type === MATCHES.OPEN && (
					<SC.MatchItemRow key={`${match.maturityDate}-${MATCHES.OPEN}`} onClick={handleOnClickRow}>
						<SC.MatchItemCol $alignItems={'flex-start'} span={8 + getPushNumber()}>
							{getContestedTeams}
						</SC.MatchItemCol>
						{includes(getBaseBetTypes(), BetType.WINNER) && (
							<SC.MatchItemCol span={getSpanNumber(BetType.WINNER)}>
								<SC.Header>{t('Winner')}</SC.Header>
								<SC.RowItemContent>
									<SC.RadioGroup>
										<OddButton
											isHeader
											match={match}
											setVisibleTotalWinnerModal={isTotalWinner ? setVisibleTotalWinnerModal : undefined}
											betOption={BET_OPTIONS.WINNER_HOME}
											oddName={isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_HOME}
										/>
										<OddButton isHeader match={match} betOption={BET_OPTIONS.WINNER_DRAW} />
										<OddButton isHeader match={match} betOption={BET_OPTIONS.WINNER_AWAY} />
									</SC.RadioGroup>
									<SC.OddsWrapper>
										<OddValue match={match} betOption={BET_OPTIONS.WINNER_HOME} />
										<OddValue match={match} betOption={BET_OPTIONS.WINNER_DRAW} />
										<OddValue match={match} betOption={BET_OPTIONS.WINNER_AWAY} />
									</SC.OddsWrapper>
								</SC.RowItemContent>
							</SC.MatchItemCol>
						)}
						{includes(getBaseBetTypes(), BetType.DOUBLE_CHANCE) &&
							match.doubleChanceTypeMatches &&
							match.doubleChanceTypeMatches?.length > 0 &&
							!(chain?.id === NETWORK_IDS.OPTIMISM_GOERLI) && (
								<SC.MatchItemCol span={getSpanNumber(BetType.DOUBLE_CHANCE)}>
									<SC.Header>{t('Double chance')}</SC.Header>
									{getOddByBetType(match as any, false, BET_OPTIONS.DOUBLE_CHANCE_HOME).formattedOdd === 0 && (
										<SC.WarningText>{t('Coming soon')}</SC.WarningText>
									)}
									<SC.RowItemContent>
										<SC.RadioGroup>
											<OddButton isHeader match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_HOME} />
											<OddButton isHeader match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_DRAW} />
											<OddButton isHeader match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_AWAY} />
										</SC.RadioGroup>
										<SC.OddsWrapper>
											<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_HOME} />
											<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_DRAW} />
											<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_AWAY} />
										</SC.OddsWrapper>
									</SC.RowItemContent>
								</SC.MatchItemCol>
							)}
						{includes(getBaseBetTypes(), BetType.SPREAD) && spreadTypeMatch && (
							<SC.MatchItemCol span={getSpanNumber(BetType.SPREAD)}>
								<SC.Header>{t('Handicap ({{ spread }})', { spread: roundToTwoDecimals(spreadTypeMatch?.spread || 0) })}</SC.Header>
								<SC.RowItemContent>
									<SC.RadioGroup>
										<OddButton isHeader match={match} betOption={BET_OPTIONS.HANDICAP_HOME} />
										<OddButton isHeader match={match} betOption={BET_OPTIONS.HANDICAP_AWAY} />
									</SC.RadioGroup>
									<SC.OddsWrapper>
										<OddValue match={match} betOption={BET_OPTIONS.HANDICAP_HOME} />
										<OddValue match={match} betOption={BET_OPTIONS.HANDICAP_AWAY} />
									</SC.OddsWrapper>
								</SC.RowItemContent>
							</SC.MatchItemCol>
						)}
						{includes(getBaseBetTypes(), BetType.TOTAL) && totalTypeMatch && (
							<SC.MatchItemCol span={getSpanNumber(BetType.TOTAL)}>
								<SC.Header>{t('Total ({{ total }})', { total: roundToTwoDecimals(totalTypeMatch?.total || 0) })}</SC.Header>
								<SC.RowItemContent>
									<SC.RadioGroup>
										<OddButton isHeader match={match} betOption={BET_OPTIONS.TOTAL_OVER} />
										<OddButton isHeader match={match} betOption={BET_OPTIONS.TOTAL_UNDER} />
									</SC.RadioGroup>
									<SC.OddsWrapper>
										<OddValue match={match} betOption={BET_OPTIONS.TOTAL_OVER} />
										<OddValue match={match} betOption={BET_OPTIONS.TOTAL_UNDER} />
									</SC.OddsWrapper>
								</SC.RowItemContent>
							</SC.MatchItemCol>
						)}
					</SC.MatchItemRow>
				)}
				{type === MATCHES.ONGOING && (
					<SC.MatchItemRow key={`${match.maturityDate}-${MATCHES.ONGOING}`}>
						<SC.MatchItemCol $alignItems={'flex-start'} span={16}>
							{getContestedTeams}
						</SC.MatchItemCol>
						<SC.MatchItemCol span={8}>
							<SC.Header>{t('Status')}</SC.Header>
							<SC.StatusWrapper>
								<SCS.Icon icon={ClockIcon} />
								{t('Ongoing')}
							</SC.StatusWrapper>
						</SC.MatchItemCol>
					</SC.MatchItemRow>
				)}
				{type === MATCHES.FINISHED && (
					<SC.MatchItemRow key={`${match.maturityDate}-${MATCHES.FINISHED}`}>
						<SC.MatchItemCol $alignItems={'flex-start'} span={16}>
							{getContestedTeams}
						</SC.MatchItemCol>
						<SC.MatchItemCol span={8}>
							<SC.Header>{t('Results')}</SC.Header>
							<SC.StatusWrapper>{formatFinishedResults()}</SC.StatusWrapper>
						</SC.MatchItemCol>
					</SC.MatchItemRow>
				)}
				{type === MATCHES.PAUSED && (
					<SC.MatchItemRow key={`${match.maturityDate}-${MATCHES.PAUSED}`}>
						<SC.MatchItemCol span={16}>{getContestedTeams}</SC.MatchItemCol>
						<SC.MatchItemCol span={8}>
							<SC.Header>{t('Status')}</SC.Header>
							<SC.StatusWrapper>
								<SCS.Icon icon={PauseIcon} />
								{t('Paused')}
							</SC.StatusWrapper>
						</SC.MatchItemCol>
					</SC.MatchItemRow>
				)}
			</SC.PCContentWrapper>
		</>
	)
}

export default MatchListHeader
