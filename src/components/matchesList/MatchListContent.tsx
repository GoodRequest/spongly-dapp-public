import { FC, useState } from 'react'
import { getFormValues } from 'redux-form'
import { useNetwork } from 'wagmi'

// hooks
import { useTranslation } from 'next-export-i18n'
import { useDispatch, useSelector } from 'react-redux'

// types
import { SportMarket } from '@/__generated__/resolvers-types'

// utils
import { formatMarketOdds, getFormattedBonus } from '@/utils/markets'
import { SGPItem, SportMarketInfo } from '@/typescript/types'
import { DoubleChanceMarketType } from '@/utils/tags'
import { MIN_ODD_TRESHOLD, NETWORK_IDS, OddsType, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { BET_OPTIONS, FORM, RESOLUTIONS } from '@/utils/enums'

// redux
import { updateActiveTicketMatches } from '@/redux/betTickets/betTicketsActions'
import { IUnsubmittedBetTicket } from '@/redux/betTickets/betTicketTypes'

// components
import * as SC from './MatchesListStyles'

import { RootState } from '@/redux/rootReducer'
import {
	formatMatchCombinedPositionsQuote,
	checkTotalWinnerBetExist,
	getHandicapValue,
	roundToTwoDecimals,
	updateUnsubmittedTicketMatches
} from '@/utils/helpers'
import Modal from '@/components/modal/Modal'

interface IMatchListContent {
	match: SportMarket & {
		winnerTypeMatch?: SportMarketInfo
		doubleChanceTypeMatches?: SportMarketInfo[]
		spreadTypeMatch?: SportMarketInfo
		totalTypeMatch?: SportMarketInfo
		combinedTypeMatch?: SGPItem
	}
}

const MatchListContent: FC<IMatchListContent> = ({ match }) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { chain } = useNetwork()
	const { matches: matchesInActiveTicket } = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const { winnerTypeMatch, doubleChanceTypeMatches, spreadTypeMatch, totalTypeMatch, combinedTypeMatch } = match
	const unsubmittedTickets = useSelector((state: RootState) => state.betTickets.unsubmittedBetTickets.data)
	const activeTicketValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(winnerTypeMatch?.tags[0] as any)
	const [visibleTotalWinnerModal, setVisibleTotalWinnerModal] = useState(false)
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

	const formattedCombinedTypeMatch = {
		[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER]: formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.homeOdds),
			Number(match.totalTypeMatch?.homeOdds),
			Number(combinedTypeMatch?.SGPFee)
		),
		[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER]: formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.homeOdds),
			Number(match.totalTypeMatch?.awayOdds),
			Number(combinedTypeMatch?.SGPFee)
		),
		[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER]: formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.awayOdds),
			Number(match.totalTypeMatch?.homeOdds),
			Number(combinedTypeMatch?.SGPFee)
		),
		[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER]: formatMatchCombinedPositionsQuote(
			Number(match.winnerTypeMatch?.awayOdds),
			Number(match.totalTypeMatch?.awayOdds),
			Number(combinedTypeMatch?.SGPFee)
		)
	}
	const isMatchInActiveTicket = matchesInActiveTicket?.find((m) => m.gameId === match.gameId)

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
		<div>
			<SC.SmallMatchContentWrapper>
				{modals}
				<SC.AllPositionsHeader>{t('All positions')}</SC.AllPositionsHeader>
				{winnerTypeMatch && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>
							<span>{t('Winner')}</span>
						</SC.RadioMobileHeader>
						<SC.RadioMobileGroup>
							{formattedWinnerTypeMatch.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									isMobilePanel={true}
									value={BET_OPTIONS.WINNER_HOME}
									active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_HOME}
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
								(Number(match.drawOdds) !== 0 && formattedWinnerTypeMatch.drawOdds > MIN_ODD_TRESHOLD && (
									<SC.OddButton
										isMobilePanel={true}
										value={BET_OPTIONS.WINNER_DRAW}
										active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_DRAW}
										onClick={() => {
											const matches = dispatch(
												updateActiveTicketMatches({ ...match, betOption: BET_OPTIONS.WINNER_DRAW }, matchesInActiveTicket)
											)
											updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
										}}
									>
										{isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_DRAW}
									</SC.OddButton>
								))}
							{formattedWinnerTypeMatch.awayOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									isMobilePanel={true}
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
							{formattedWinnerTypeMatch.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedWinnerTypeMatch.homeOdds}
									{!!formattedWinnerTypeMatch.homeBonus && formattedWinnerTypeMatch.homeBonus > 0 && (
										<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch.homeBonus)}</SC.BonusLabel>
									)}
								</SC.Odd>
							)}
							{!match.drawOdds ||
								(Number(match.drawOdds) !== 0 && formattedWinnerTypeMatch.drawOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedWinnerTypeMatch.drawOdds}
										{!!formattedWinnerTypeMatch.drawBonus && formattedWinnerTypeMatch.drawBonus > 0 && (
											<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch.drawBonus)}</SC.BonusLabel>
										)}
									</SC.Odd>
								))}
							{formattedWinnerTypeMatch.awayOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedWinnerTypeMatch.awayOdds}
									{!!formattedWinnerTypeMatch.awayBonus && formattedWinnerTypeMatch.awayBonus > 0 && (
										<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch.awayBonus)}</SC.BonusLabel>
									)}
								</SC.Odd>
							)}
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
				{doubleChanceTypeMatches && doubleChanceTypeMatches.length > 0 && !(chain?.id === NETWORK_IDS.OPTIMISM_GOERLI) && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>
							<span>{t('Double chance')}</span>
						</SC.RadioMobileHeader>
						<SC.RadioMobileGroup>
							{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									isMobilePanel={true}
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
									isMobilePanel={true}
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
									isMobilePanel={true}
									value={BET_OPTIONS.DOUBLE_CHANCE_HOME}
									active={isMatchInActiveTicket?.betOption === BET_OPTIONS.DOUBLE_CHANCE_AWAY}
									onClick={() => {
										dispatch(
											updateActiveTicketMatches(
												{
													...match,
													betOption: BET_OPTIONS.DOUBLE_CHANCE_AWAY
												},
												matchesInActiveTicket
											)
										)
										updateUnsubmittedTicketMatches(matchesInActiveTicket, unsubmittedTickets, dispatch, activeTicketValues.id)
									}}
								>
									{BET_OPTIONS.DOUBLE_CHANCE_AWAY}
								</SC.OddButton>
							)}
						</SC.RadioMobileGroup>
						<SC.OddsWrapper>
							{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds}
									{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE].homeBonus &&
										formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE].homeBonus > 0 && (
											<SC.BonusLabel>
												{getFormattedBonus(formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE].homeBonus)}
											</SC.BonusLabel>
										)}
								</SC.Odd>
							)}
							{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeOdds}
									{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW].homeBonus &&
										formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW].homeBonus > 0 && (
											<SC.BonusLabel>
												{getFormattedBonus(formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW].homeBonus)}
											</SC.BonusLabel>
										)}
								</SC.Odd>
							)}
							{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeOdds}
									{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE].homeOdds &&
										formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE].homeOdds > 0 && (
											<SC.BonusLabel>
												{getFormattedBonus(formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE].homeOdds)}
											</SC.BonusLabel>
										)}
								</SC.Odd>
							)}
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
				{spreadTypeMatch && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>
							<span>{t('Handicap')}</span>
						</SC.RadioMobileHeader>
						<SC.RadioMobileGroup>
							{formattedSpreadTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									isMobilePanel={true}
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
									{BET_OPTIONS.HANDICAP_HOME} ({getHandicapValue(spreadTypeMatch.spread, BET_OPTIONS.HANDICAP_HOME)})
								</SC.OddButton>
							)}
							{formattedSpreadTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									isMobilePanel={true}
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
									{BET_OPTIONS.HANDICAP_AWAY} ({getHandicapValue(spreadTypeMatch.spread, BET_OPTIONS.HANDICAP_AWAY)})
								</SC.OddButton>
							)}
						</SC.RadioMobileGroup>
						<SC.OddsWrapper>
							{formattedSpreadTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedSpreadTypeMatch?.homeOdds}
									{!!formattedSpreadTypeMatch.homeBonus && formattedSpreadTypeMatch.homeBonus > 0 && (
										<SC.BonusLabel>{getFormattedBonus(formattedSpreadTypeMatch.homeBonus)}</SC.BonusLabel>
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
					</SC.MobileWrapper>
				)}
				{totalTypeMatch && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>
							<span>{t('Total')}</span>
						</SC.RadioMobileHeader>
						<SC.RadioMobileGroup>
							{formattedTotalTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									isMobilePanel={true}
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
									{BET_OPTIONS.TOTAL_OVER} ({roundToTwoDecimals(totalTypeMatch.total || 0)})
								</SC.OddButton>
							)}
							{formattedTotalTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									isMobilePanel={true}
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
									{BET_OPTIONS.TOTAL_UNDER} ({roundToTwoDecimals(totalTypeMatch.total || 0)})
								</SC.OddButton>
							)}
						</SC.RadioMobileGroup>
						<SC.OddsWrapper>
							{formattedTotalTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedTotalTypeMatch?.homeOdds}
									{formattedTotalTypeMatch.homeBonus && formattedTotalTypeMatch.homeBonus > 0 && (
										<SC.BonusLabel>{getFormattedBonus(formattedTotalTypeMatch.homeBonus)}</SC.BonusLabel>
									)}
								</SC.Odd>
							)}
							{formattedTotalTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
								<SC.Odd>
									{formattedTotalTypeMatch?.awayOdds}
									{formattedTotalTypeMatch.awayBonus && formattedTotalTypeMatch.awayBonus > 0 && (
										<SC.BonusLabel>{getFormattedBonus(formattedTotalTypeMatch.awayBonus)}</SC.BonusLabel>
									)}
								</SC.Odd>
							)}
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
				{combinedTypeMatch && totalTypeMatch && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>
							<span>{t('Combined')}</span>
						</SC.RadioMobileHeader>
						<SC.RadioMobileGroup>
							{/* // 1O */}
							{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER] > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									isMobilePanel={true}
									// TODO: undisabled when CH-276 fixed
									disabled={true}
									value={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER}
									active={isMatchInActiveTicket?.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER}
									onClick={() => {
										const matches = dispatch(
											updateActiveTicketMatches(
												{
													...match,
													betOption: BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER
												},
												matchesInActiveTicket
											)
										)
										updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
									}}
								>
									{`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER[0]}&${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER[1]}`} (
									{roundToTwoDecimals(totalTypeMatch.total || 0)})
								</SC.OddButton>
							)}
							{/* // 1U */}
							{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER] > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									// TODO: undisabled when CH-276 fixed
									disabled={true}
									isMobilePanel={true}
									value={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER}
									active={isMatchInActiveTicket?.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER}
									onClick={() => {
										const matches = dispatch(
											updateActiveTicketMatches(
												{
													...match,
													betOption: BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER
												},
												matchesInActiveTicket
											)
										)
										updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
									}}
								>
									{`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER[0]}&${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER[1]}`} (
									{roundToTwoDecimals(totalTypeMatch.total || 0)})
								</SC.OddButton>
							)}
							{/* // 2O */}
							{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER] > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									// TODO: undisabled when CH-276 fixed
									disabled={true}
									isMobilePanel={true}
									value={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER}
									active={isMatchInActiveTicket?.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER}
									onClick={() => {
										const matches = dispatch(
											updateActiveTicketMatches(
												{
													...match,
													betOption: BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER
												},
												matchesInActiveTicket
											)
										)
										updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
									}}
								>
									{`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER[0]}&${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER[1]}`} (
									{roundToTwoDecimals(totalTypeMatch.total || 0)})
								</SC.OddButton>
							)}
							{/* // 2U */}
							{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER] > MIN_ODD_TRESHOLD && (
								<SC.OddButton
									// TODO: undisabled when CH-276 fixed
									disabled={true}
									isMobilePanel={true}
									value={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER}
									active={isMatchInActiveTicket?.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER}
									onClick={() => {
										const matches = dispatch(
											updateActiveTicketMatches(
												{
													...match,
													betOption: BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER
												},
												matchesInActiveTicket
											)
										)
										updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
									}}
								>
									{`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER[0]}&${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER[1]}`} (
									{roundToTwoDecimals(totalTypeMatch.total || 0)})
								</SC.OddButton>
							)}
						</SC.RadioMobileGroup>
						<SC.OddsWrapper>
							{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER] > MIN_ODD_TRESHOLD && (
								<SC.Odd>{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER]}</SC.Odd>
							)}
							{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER] > MIN_ODD_TRESHOLD && (
								<SC.Odd>{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER]}</SC.Odd>
							)}
							{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER] > MIN_ODD_TRESHOLD && (
								<SC.Odd>{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER]}</SC.Odd>
							)}
							{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER] > MIN_ODD_TRESHOLD && (
								<SC.Odd>{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER]}</SC.Odd>
							)}
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
			</SC.SmallMatchContentWrapper>
			<SC.ExtendedMatchContentWrapper>
				{winnerTypeMatch && (
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Winner')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							<SC.ExtendedMatchContentRadioButtonGroup>
								{formattedWinnerTypeMatch.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
										value={BET_OPTIONS.WINNER_HOME}
										active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_HOME}
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
									</SC.ExtendedMatchContentOddButton>
								)}
								{!match.drawOdds ||
									(Number(match.drawOdds) !== 0 && formattedWinnerTypeMatch.drawOdds > MIN_ODD_TRESHOLD && (
										<SC.ExtendedMatchContentOddButton
											value={BET_OPTIONS.WINNER_DRAW}
											active={isMatchInActiveTicket?.betOption === BET_OPTIONS.WINNER_DRAW}
											onClick={() => {
												const matches = dispatch(
													updateActiveTicketMatches({ ...match, betOption: BET_OPTIONS.WINNER_DRAW }, matchesInActiveTicket)
												)
												updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
											}}
										>
											{BET_OPTIONS.WINNER_DRAW}
										</SC.ExtendedMatchContentOddButton>
									))}
								{formattedWinnerTypeMatch.awayOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
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
									</SC.ExtendedMatchContentOddButton>
								)}
							</SC.ExtendedMatchContentRadioButtonGroup>
							<SC.ExtendedOddsWrapper>
								{formattedWinnerTypeMatch.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedWinnerTypeMatch.homeOdds}
										{!!formattedWinnerTypeMatch.homeBonus && formattedWinnerTypeMatch.homeBonus > 0 && (
											<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch.homeBonus)}</SC.BonusLabel>
										)}
									</SC.Odd>
								)}
								{!match.drawOdds ||
									(Number(match.drawOdds) !== 0 && formattedWinnerTypeMatch.drawOdds > MIN_ODD_TRESHOLD && (
										<SC.Odd>
											{formattedWinnerTypeMatch.drawOdds}
											{!!formattedWinnerTypeMatch.drawBonus && formattedWinnerTypeMatch.drawBonus > 0 && (
												<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch.drawBonus)}</SC.BonusLabel>
											)}
										</SC.Odd>
									))}
								{formattedWinnerTypeMatch.awayOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedWinnerTypeMatch.awayOdds}
										{!!formattedWinnerTypeMatch.awayBonus && formattedWinnerTypeMatch.awayBonus > 0 && (
											<SC.BonusLabel>{getFormattedBonus(formattedWinnerTypeMatch.awayBonus)}</SC.BonusLabel>
										)}
									</SC.Odd>
								)}
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{doubleChanceTypeMatches && doubleChanceTypeMatches.length > 0 && !(chain?.id === NETWORK_IDS.OPTIMISM_GOERLI) && (
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Double chance')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							<SC.ExtendedMatchContentRadioButtonGroup>
								{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
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
									</SC.ExtendedMatchContentOddButton>
								)}
								{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
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
									</SC.ExtendedMatchContentOddButton>
								)}
								{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
										value={BET_OPTIONS.DOUBLE_CHANCE_HOME}
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
									</SC.ExtendedMatchContentOddButton>
								)}
							</SC.ExtendedMatchContentRadioButtonGroup>
							<SC.ExtendedOddsWrapper>
								{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE]?.homeOdds}
										{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE].homeBonus &&
											formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE].homeBonus > 0 && (
												<SC.BonusLabel>
													{getFormattedBonus(
														formattedDoubleChanceTypeMatches[DoubleChanceMarketType.HOME_TEAM_NOT_TO_LOSE].homeBonus
													)}
												</SC.BonusLabel>
											)}
									</SC.Odd>
								)}
								{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW]?.homeOdds}
										{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW].homeBonus &&
											formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW].homeBonus > 0 && (
												<SC.BonusLabel>
													{getFormattedBonus(formattedDoubleChanceTypeMatches[DoubleChanceMarketType.NO_DRAW].homeBonus)}
												</SC.BonusLabel>
											)}
									</SC.Odd>
								)}
								{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE]?.homeOdds}
										{!!formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE].homeOdds &&
											formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE].homeOdds > 0 && (
												<SC.BonusLabel>
													{getFormattedBonus(formattedDoubleChanceTypeMatches[DoubleChanceMarketType.AWAY_TEAM_NOT_TO_LOSE].homeOdds)}
												</SC.BonusLabel>
											)}
									</SC.Odd>
								)}
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{spreadTypeMatch && (
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Handicap')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							<SC.ExtendedMatchContentRadioButtonGroup>
								{formattedSpreadTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
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
										{BET_OPTIONS.HANDICAP_HOME} ({getHandicapValue(spreadTypeMatch.spread, BET_OPTIONS.HANDICAP_HOME)})
									</SC.ExtendedMatchContentOddButton>
								)}
								{formattedSpreadTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
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
										{BET_OPTIONS.HANDICAP_AWAY} ({getHandicapValue(spreadTypeMatch.spread, BET_OPTIONS.HANDICAP_AWAY)})
									</SC.ExtendedMatchContentOddButton>
								)}
							</SC.ExtendedMatchContentRadioButtonGroup>
							<SC.ExtendedOddsWrapper>
								{formattedSpreadTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedSpreadTypeMatch?.homeOdds}
										{!!formattedSpreadTypeMatch.homeBonus && formattedSpreadTypeMatch.homeBonus > 0 && (
											<SC.BonusLabel>{getFormattedBonus(formattedSpreadTypeMatch.homeBonus)}</SC.BonusLabel>
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
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{totalTypeMatch && (
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Total')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							<SC.ExtendedMatchContentRadioButtonGroup>
								{formattedTotalTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
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
										{BET_OPTIONS.TOTAL_OVER} ({roundToTwoDecimals(totalTypeMatch.total || 0)})
									</SC.ExtendedMatchContentOddButton>
								)}
								{formattedTotalTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
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
										{BET_OPTIONS.TOTAL_UNDER} ({roundToTwoDecimals(totalTypeMatch.total || 0)})
									</SC.ExtendedMatchContentOddButton>
								)}
							</SC.ExtendedMatchContentRadioButtonGroup>
							<SC.ExtendedOddsWrapper>
								{formattedTotalTypeMatch?.homeOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedTotalTypeMatch?.homeOdds}
										{formattedTotalTypeMatch.homeBonus && formattedTotalTypeMatch.homeBonus > 0 && (
											<SC.BonusLabel>{getFormattedBonus(formattedTotalTypeMatch.homeBonus)}</SC.BonusLabel>
										)}
									</SC.Odd>
								)}
								{formattedTotalTypeMatch?.awayOdds > MIN_ODD_TRESHOLD && (
									<SC.Odd>
										{formattedTotalTypeMatch?.awayOdds}
										{formattedTotalTypeMatch.awayBonus && formattedTotalTypeMatch.awayBonus > 0 && (
											<SC.BonusLabel>{getFormattedBonus(formattedTotalTypeMatch.awayBonus)}</SC.BonusLabel>
										)}
									</SC.Odd>
								)}
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{combinedTypeMatch && totalTypeMatch && (
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Combined')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							<SC.ExtendedMatchContentRadioButtonGroup>
								{/* // 1O */}
								{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER] > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
										value={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER}
										active={isMatchInActiveTicket?.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER}
										// TODO: undisabled when CH-276 fixed
										disabled={true}
										onClick={() => {
											const matches = dispatch(
												updateActiveTicketMatches(
													{
														...match,
														betOption: BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER
													},
													matchesInActiveTicket
												)
											)
											updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
										}}
									>
										{`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER[0]}&${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER[1]}`} (
										{roundToTwoDecimals(totalTypeMatch.total || 0)})
									</SC.ExtendedMatchContentOddButton>
								)}
								{/* 1U */}
								{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER] > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
										value={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER}
										active={isMatchInActiveTicket?.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER}
										// TODO: undisabled when CH-276 fixed
										disabled={true}
										onClick={() => {
											const matches = dispatch(
												updateActiveTicketMatches(
													{
														...match,
														betOption: BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER
													},
													matchesInActiveTicket
												)
											)
											updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
										}}
									>
										{`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER[0]}&${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER[1]}`} (
										{roundToTwoDecimals(totalTypeMatch.total || 0)})
									</SC.ExtendedMatchContentOddButton>
								)}
								{/* 2O */}
								{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER] > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
										value={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER}
										active={isMatchInActiveTicket?.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER}
										// TODO: undisabled when CH-276 fixed
										disabled={true}
										onClick={() => {
											const matches = dispatch(
												updateActiveTicketMatches(
													{
														...match,
														betOption: BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER
													},
													matchesInActiveTicket
												)
											)
											updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
										}}
									>
										{`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER[0]}&${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER[1]}`} (
										{roundToTwoDecimals(totalTypeMatch.total || 0)})
									</SC.ExtendedMatchContentOddButton>
								)}
								{/* 2U */}
								{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER] > MIN_ODD_TRESHOLD && (
									<SC.ExtendedMatchContentOddButton
										value={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER}
										active={isMatchInActiveTicket?.betOption === BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER}
										// TODO: undisabled when CH-276 fixed
										disabled={true}
										onClick={() => {
											const matches = dispatch(
												updateActiveTicketMatches(
													{
														...match,
														betOption: BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER
													},
													matchesInActiveTicket
												)
											)
											updateUnsubmittedTicketMatches(matches, unsubmittedTickets, dispatch, activeTicketValues.id)
										}}
									>
										{`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER[0]}&${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER[1]}`} (
										{roundToTwoDecimals(totalTypeMatch.total || 0)})
									</SC.ExtendedMatchContentOddButton>
								)}
							</SC.ExtendedMatchContentRadioButtonGroup>
							<SC.ExtendedOddsWrapper>
								{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER] > MIN_ODD_TRESHOLD && (
									<SC.Odd>{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER]}</SC.Odd>
								)}
								{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER] > MIN_ODD_TRESHOLD && (
									<SC.Odd>{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER]}</SC.Odd>
								)}
								{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER] > MIN_ODD_TRESHOLD && (
									<SC.Odd>{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER]}</SC.Odd>
								)}
								{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER] > MIN_ODD_TRESHOLD && (
									<SC.Odd>{formattedCombinedTypeMatch[BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER]}</SC.Odd>
								)}
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{modals}
			</SC.ExtendedMatchContentWrapper>
		</div>
	)
}

export default MatchListContent
