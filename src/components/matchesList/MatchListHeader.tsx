import { FC, useMemo, useState } from 'react'
import { includes, toNumber } from 'lodash'
import { getFormValues } from 'redux-form'
import { Col, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'

// components
import Modal from '../modal/Modal'

// utils
import { BET_OPTIONS, FORM, MATCHES } from '@/utils/enums'
import { SportFilterEnum, OddsType, NO_TEAM_IMAGE_FALLBACK, NETWORK_IDS, MIN_ODD_TRESHOLD, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { BetType, DoubleChanceMarketType, SPORTS_MAP } from '@/utils/tags'
import { getTeamImageSource } from '@/utils/images'
import { checkTotalWinnerBetExist, getFormatDate, roundToTwoDecimals, updateUnsubmittedTicketMatches } from '@/utils/helpers'
import { formatMarketOdds, getFormattedBonus } from '@/utils/markets'

// icons
import PauseIcon from '@/assets/icons/pause.svg'
import ClockIcon from '@/assets/icons/clock.svg'

// types
import { SportMarket } from '@/__generated__/resolvers-types'
import { SportMarketInfo } from '@/typescript/types'
import { RootState } from '@/redux/rootReducer'

// redux
import { updateActiveTicketMatches } from '@/redux/betTickets/betTicketsActions'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'

// styles
import * as SC from './MatchesListStyles'
import * as SCS from '@/styles/GlobalStyles'

interface IMatchListItem {
	match: SportMarket & {
		winnerTypeMatch?: SportMarketInfo
		doubleChanceTypeMatches?: SportMarketInfo[]
		spreadTypeMatch?: SportMarketInfo
		totalTypeMatch?: SportMarketInfo
	}
	type: MATCHES
}

const MatchListHeader: FC<IMatchListItem> = ({ match, type = MATCHES.OPEN }) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const { chain } = useNetwork()
	const [visibleTotalWinnerModal, setVisibleTotalWinnerModal] = useState(false)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const { winnerTypeMatch, doubleChanceTypeMatches, spreadTypeMatch, totalTypeMatch } = match
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const matchesInActiveTicket = activeTicketValues?.matches
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(winnerTypeMatch?.tags[0] as any)
	const isOnlyWinner = winnerTypeMatch && doubleChanceTypeMatches?.length === 0 && !spreadTypeMatch && !totalTypeMatch
	const formattedWinnerTypeMatch = formatMarketOdds(OddsType.DECIMAL, winnerTypeMatch)

	const formattedDoubleChanceTypeMatches = doubleChanceTypeMatches
		? Object.assign(
				{},
				...doubleChanceTypeMatches.map((match: SportMarketInfo) => ({
					[match.doubleChanceMarketType as DoubleChanceMarketType]: formatMarketOdds(OddsType.DECIMAL, match)
				}))
		  )
		: undefined
	const formattedSpreadTypeMatch = formatMarketOdds(OddsType.DECIMAL, spreadTypeMatch)
	const formattedTotalTypeMatch = formatMarketOdds(OddsType.DECIMAL, totalTypeMatch)

	const isMatchInActiveTicket = matchesInActiveTicket?.find((m) => m.gameId === match.gameId)

	const formatFinishedResults = () => {
		if (isTotalWinner) {
			if (match.winnerTypeMatch?.homeScore === '1') {
				return <span>{t('Winner')}</span>
			}
			return <span>{t('No win')}</span>
		}
		return <span>{`${match.homeScore || '?'} : ${match.awayScore || '?'}`}</span>
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

	const modals = (
		<Modal
			open={visibleTotalWinnerModal}
			onCancel={() => {
				setVisibleTotalWinnerModal(false)
			}}
			title={t('Parlay Validation') as string}
			centered
		>
			<SC.ModalDescriptionText>{t('Only one participant per event is supported.')}</SC.ModalDescriptionText>
		</Modal>
	)

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
						{modals}
						<SC.MobileDivider />
						<SC.RadioMobileHeader>
							<span>{t('Winner')}</span>
						</SC.RadioMobileHeader>
						<SC.RadioMobileGroup>
							{formattedWinnerTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									id={`${match.gameId}-${BET_OPTIONS.WINNER_HOME}`}
									active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_HOME}
									value={BET_OPTIONS.WINNER_HOME}
									onClick={() => {
										if (checkTotalWinnerBetExist(activeTicketValues, match)) {
											setVisibleTotalWinnerModal(true)
										} else {
											const matches = dispatch(
												updateActiveTicketMatches(
													{
														...match,
														betOption: BET_OPTIONS.WINNER_HOME
													},
													matchesInActiveTicket
												)
											)
											updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
										}
									}}
								>
									{isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_HOME}
								</SC.OddButton>
							)}
							{!match.drawOdds ||
								(Number(match.drawOdds) !== 0 && formattedWinnerTypeMatch?.drawOdds > MIN_ODD_TRESHOLD && (
									<SC.OddButton
										active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_DRAW}
										value={BET_OPTIONS.WINNER_DRAW}
										onClick={() => {
											const matches = dispatch(
												updateActiveTicketMatches({ ...match, betOption: BET_OPTIONS.WINNER_DRAW }, matchesInActiveTicket)
											)
											updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
										}}
									>
										{BET_OPTIONS.WINNER_DRAW}
									</SC.OddButton>
								))}
							{formattedWinnerTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									value={BET_OPTIONS.WINNER_AWAY}
									active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_AWAY}
									onClick={() => {
										const matches = dispatch(
											updateActiveTicketMatches(
												{
													...match,
													betOption: BET_OPTIONS.WINNER_AWAY
												},
												matchesInActiveTicket
											)
										)
										updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
									}}
								>
									{BET_OPTIONS.WINNER_AWAY}
								</SC.OddButton>
							)}
						</SC.RadioMobileGroup>
						<SC.OddsWrapper>
							{/* TODO: use active ODDS_TYPE */}
							{formattedWinnerTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedWinnerTypeMatch?.homeOdds}
									{!!formattedWinnerTypeMatch?.homeBonus && formattedWinnerTypeMatch?.homeBonus > 0 && (
										<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch?.homeBonus)}</SC.BonusLabel>
									)}
								</SC.Odd>
							)}
							{!match.drawOdds ||
								(Number(match.drawOdds) !== 0 && formattedWinnerTypeMatch?.drawOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>{formattedWinnerTypeMatch?.drawOdds}</SC.Odd>
								))}
							{formattedWinnerTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedWinnerTypeMatch?.awayOdds}
									{!!formattedWinnerTypeMatch.awayBonus && formattedWinnerTypeMatch.awayBonus > 0 && (
										<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch.awayBonus)}</SC.BonusLabel>
									)}
								</SC.Odd>
							)}
						</SC.OddsWrapper>
					</>
				)}
				{type === MATCHES.ONGOING && (
					<SC.MobileStatusWrapper type={MATCHES.ONGOING}>
						<span>{t('ONGOING')}</span>
					</SC.MobileStatusWrapper>
				)}
				{type === MATCHES.FINISHED && <SC.MobileStatusWrapper type={MATCHES.FINISHED}>{formatFinishedResults()}</SC.MobileStatusWrapper>}
				{type === MATCHES.PAUSED && (
					<SC.MobileStatusWrapper type={MATCHES.FINISHED}>
						<span>{t('PAUSED')}</span>
					</SC.MobileStatusWrapper>
				)}
			</SC.MobileContentWrapper>
			<SC.PCContentWrapper>
				{modals}
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
										{formattedWinnerTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
											<SC.OddButton
												id={`${match.gameId}-${BET_OPTIONS.WINNER_HOME}`}
												active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_HOME}
												value={BET_OPTIONS.WINNER_HOME}
												onClick={() => {
													if (checkTotalWinnerBetExist(activeTicketValues, match)) {
														setVisibleTotalWinnerModal(true)
													} else {
														const matches = dispatch(
															updateActiveTicketMatches(
																{
																	...match,
																	betOption: BET_OPTIONS.WINNER_HOME
																},
																matchesInActiveTicket
															)
														)
														updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
													}
												}}
											>
												{isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_HOME}
											</SC.OddButton>
										)}
										{!match.drawOdds ||
											(Number(match.drawOdds) !== 0 && formattedWinnerTypeMatch?.drawOdds > MIN_ODD_TRESHOLD && (
												<SC.OddButton
													active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_DRAW}
													value={BET_OPTIONS.WINNER_DRAW}
													onClick={() => {
														const matches = dispatch(
															updateActiveTicketMatches({ ...match, betOption: BET_OPTIONS.WINNER_DRAW }, matchesInActiveTicket)
														)
														updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
													}}
												>
													{BET_OPTIONS.WINNER_DRAW}
												</SC.OddButton>
											))}
										{formattedWinnerTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
											<SC.OddButton
												value={BET_OPTIONS.WINNER_AWAY}
												active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_AWAY}
												onClick={() => {
													const matches = dispatch(
														updateActiveTicketMatches(
															{
																...match,
																betOption: BET_OPTIONS.WINNER_AWAY
															},
															matchesInActiveTicket
														)
													)
													updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
												}}
											>
												{BET_OPTIONS.WINNER_AWAY}
											</SC.OddButton>
										)}
									</SC.RadioGroup>
									<SC.OddsWrapper>
										{/* TODO: use active ODDS_TYPE */}
										<SC.Odd>
											{formattedWinnerTypeMatch?.homeOdds}
											{!!formattedWinnerTypeMatch?.homeBonus && formattedWinnerTypeMatch?.homeBonus > 0 && (
												<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch?.homeBonus)}</SC.BonusLabel>
											)}
										</SC.Odd>
										{!match.drawOdds ||
											(Number(match.drawOdds) !== 0 && formattedWinnerTypeMatch?.drawOdds > MIN_ODD_TRESHOLD && (
												<SC.Odd>{formattedWinnerTypeMatch?.drawOdds}</SC.Odd>
											))}
										{formattedWinnerTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
											<SC.Odd>
												{formattedWinnerTypeMatch?.awayOdds}
												{!!formattedWinnerTypeMatch.awayBonus && formattedWinnerTypeMatch.awayBonus > 0 && (
													<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch.awayBonus)}</SC.BonusLabel>
												)}
											</SC.Odd>
										)}
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
									<SC.RowItemContent>
										<SC.RadioGroup>
											{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
												<SC.OddButton
													value={BET_OPTIONS.DOUBLE_CHANCE_HOME}
													active={isMatchInActiveTicket?.betOption === BET_OPTIONS.DOUBLE_CHANCE_HOME}
													onClick={() => {
														const matches = dispatch(
															updateActiveTicketMatches(
																{
																	...match,
																	betOption: BET_OPTIONS.DOUBLE_CHANCE_HOME
																},
																matchesInActiveTicket
															)
														)
														updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
													}}
												>
													{BET_OPTIONS.DOUBLE_CHANCE_HOME}
												</SC.OddButton>
											)}
											{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeOdds > MIN_ODD_TRESHOLD && (
												<SC.OddButton
													value={BET_OPTIONS.DOUBLE_CHANCE_DRAW}
													active={isMatchInActiveTicket?.betOption === BET_OPTIONS.DOUBLE_CHANCE_DRAW}
													onClick={() => {
														const matches = dispatch(
															updateActiveTicketMatches(
																{
																	...match,
																	betOption: BET_OPTIONS.DOUBLE_CHANCE_DRAW
																},
																matchesInActiveTicket
															)
														)
														updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
													}}
												>
													{BET_OPTIONS.DOUBLE_CHANCE_DRAW}
												</SC.OddButton>
											)}
											{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
												<SC.OddButton
													value={BET_OPTIONS.DOUBLE_CHANCE_AWAY}
													active={isMatchInActiveTicket?.betOption === BET_OPTIONS.DOUBLE_CHANCE_AWAY}
													onClick={() => {
														const matches = dispatch(
															updateActiveTicketMatches(
																{
																	...match,
																	betOption: BET_OPTIONS.DOUBLE_CHANCE_AWAY
																},
																matchesInActiveTicket
															)
														)
														updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
													}}
												>
													{BET_OPTIONS.DOUBLE_CHANCE_AWAY}
												</SC.OddButton>
											)}
										</SC.RadioGroup>
										<SC.OddsWrapper>
											{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
												<SC.Odd>
													{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds}
													{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeBonus &&
														formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeBonus > 0 && (
															<SC.BonusLabel>
																{getFormattedBonus(
																	formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeBonus
																)}
															</SC.BonusLabel>
														)}
												</SC.Odd>
											)}
											{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeOdds > MIN_ODD_TRESHOLD && (
												<SC.Odd>
													{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeOdds}
													{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeBonus &&
														formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeBonus > 0 && (
															<SC.BonusLabel>
																{getFormattedBonus(formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeBonus)}
															</SC.BonusLabel>
														)}
												</SC.Odd>
											)}
											{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
												<SC.Odd>
													{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeOdds}
													{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeBonus &&
														formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeBonus > 0 && (
															<SC.BonusLabel>
																{getFormattedBonus(
																	formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeBonus
																)}
															</SC.BonusLabel>
														)}
												</SC.Odd>
											)}
										</SC.OddsWrapper>
									</SC.RowItemContent>
								</SC.MatchItemCol>
							)}
						{includes(getBaseBetTypes(), BetType.SPREAD) && spreadTypeMatch && (
							<SC.MatchItemCol span={getSpanNumber(BetType.SPREAD)}>
								<SC.Header>{t('Handicap ({{ spread }})', { spread: roundToTwoDecimals(spreadTypeMatch?.spread || 0) })}</SC.Header>
								<SC.RowItemContent>
									<SC.RadioGroup>
										{formattedSpreadTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
											<SC.OddButton
												value={BET_OPTIONS.HANDICAP_HOME}
												active={isMatchInActiveTicket?.betOption === BET_OPTIONS.HANDICAP_HOME}
												onClick={() => {
													const matches = dispatch(
														updateActiveTicketMatches(
															{
																...match,
																betOption: BET_OPTIONS.HANDICAP_HOME
															},
															matchesInActiveTicket
														)
													)
													updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
												}}
											>
												{BET_OPTIONS.HANDICAP_HOME}
											</SC.OddButton>
										)}
										{formattedSpreadTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
											<SC.OddButton
												value={BET_OPTIONS.HANDICAP_AWAY}
												active={isMatchInActiveTicket?.betOption === BET_OPTIONS.HANDICAP_AWAY}
												onClick={() => {
													const matches = dispatch(
														updateActiveTicketMatches(
															{
																...match,
																betOption: BET_OPTIONS.HANDICAP_AWAY
															},
															matchesInActiveTicket
														)
													)
													updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
												}}
											>
												{BET_OPTIONS.HANDICAP_AWAY}
											</SC.OddButton>
										)}
									</SC.RadioGroup>
									<SC.OddsWrapper>
										{formattedSpreadTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
											<SC.Odd>
												{formattedSpreadTypeMatch?.homeOdds}
												{!!formattedSpreadTypeMatch?.homeBonus && formattedSpreadTypeMatch?.homeBonus > 0 && (
													<SC.BonusLabel>{getFormattedBonus(formattedSpreadTypeMatch?.homeBonus)}</SC.BonusLabel>
												)}
											</SC.Odd>
										)}
										{formattedSpreadTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
											<SC.Odd>
												{formattedSpreadTypeMatch?.awayOdds}
												{!!formattedSpreadTypeMatch.awayBonus && formattedSpreadTypeMatch.awayBonus > 0 && (
													<SC.BonusLabel>{getFormattedBonus(formattedSpreadTypeMatch.awayBonus)}</SC.BonusLabel>
												)}
											</SC.Odd>
										)}
									</SC.OddsWrapper>
								</SC.RowItemContent>
							</SC.MatchItemCol>
						)}
						{includes(getBaseBetTypes(), BetType.TOTAL) && totalTypeMatch && (
							<SC.MatchItemCol span={getSpanNumber(BetType.TOTAL)}>
								<SC.Header>{t('Total ({{ total }})', { total: roundToTwoDecimals(totalTypeMatch?.total || 0) })}</SC.Header>
								<SC.RowItemContent>
									<SC.RadioGroup>
										{formattedTotalTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
											<SC.OddButton
												value={BET_OPTIONS.TOTAL_OVER}
												active={isMatchInActiveTicket?.betOption === BET_OPTIONS.TOTAL_OVER}
												onClick={() => {
													const matches = dispatch(
														updateActiveTicketMatches(
															{
																...match,
																betOption: BET_OPTIONS.TOTAL_OVER
															},
															matchesInActiveTicket
														)
													)
													updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
												}}
											>
												{BET_OPTIONS.TOTAL_OVER}
											</SC.OddButton>
										)}
										{formattedTotalTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
											<SC.OddButton
												value={BET_OPTIONS.TOTAL_UNDER}
												active={isMatchInActiveTicket?.betOption === BET_OPTIONS.TOTAL_UNDER}
												onClick={() => {
													const matches = dispatch(
														updateActiveTicketMatches(
															{
																...match,
																betOption: BET_OPTIONS.TOTAL_UNDER
															},
															matchesInActiveTicket
														)
													)
													updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
												}}
											>
												{BET_OPTIONS.TOTAL_UNDER}
											</SC.OddButton>
										)}
									</SC.RadioGroup>
									<SC.OddsWrapper>
										{formattedTotalTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
											<SC.Odd>
												{formattedTotalTypeMatch?.homeOdds}
												{!!formattedTotalTypeMatch?.homeBonus && formattedTotalTypeMatch?.homeBonus > 0 && (
													<SC.BonusLabel>{getFormattedBonus(formattedTotalTypeMatch?.homeBonus)}</SC.BonusLabel>
												)}
											</SC.Odd>
										)}
										{formattedTotalTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
											<SC.Odd>
												{formattedTotalTypeMatch?.awayOdds}
												{!!formattedTotalTypeMatch.awayBonus && formattedTotalTypeMatch.awayBonus > 0 && (
													<SC.BonusLabel>{getFormattedBonus(formattedTotalTypeMatch.awayBonus)}</SC.BonusLabel>
												)}
											</SC.Odd>
										)}
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
							<SC.RowItemContent>
								<SC.StatusWrapper>
									<SCS.Icon icon={ClockIcon} />
									{t('Ongoing')}
								</SC.StatusWrapper>
							</SC.RowItemContent>
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
							<SC.RowItemContent>
								<SC.StatusWrapper>{formatFinishedResults()}</SC.StatusWrapper>
							</SC.RowItemContent>
						</SC.MatchItemCol>
					</SC.MatchItemRow>
				)}
				{type === MATCHES.PAUSED && (
					<SC.MatchItemRow key={`${match.maturityDate}-${MATCHES.PAUSED}`}>
						<SC.MatchItemCol span={16}>{getContestedTeams}</SC.MatchItemCol>
						<SC.MatchItemCol span={8}>
							<SC.Header>{t('Status')}</SC.Header>
							<SC.RowItemContent>
								<SC.StatusWrapper>
									<SCS.Icon icon={PauseIcon} />
									{t('Paused')}
								</SC.StatusWrapper>
							</SC.RowItemContent>
						</SC.MatchItemCol>
					</SC.MatchItemRow>
				)}
			</SC.PCContentWrapper>
		</>
	)
}

export default MatchListHeader
