import { Dispatch, FC, SetStateAction } from 'react'
import { useNetwork } from 'wagmi'
import { useTranslation } from 'next-export-i18n'

// utils
import { NETWORK_IDS, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { BET_OPTIONS } from '@/utils/enums'
import { getHandicapValue, getOddByBetType } from '@/utils/helpers'
import { roundToTwoDecimals } from '@/utils/formatters/number'

// redux
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'

// components
import OddButton from '@/components/oddButton/OddButton'
import OddValue from '@/components/oddButton/OddValue'

// styles
import * as SC from './MatchesListStyles'

interface IMatchListContent {
	match: TicketPosition
	setVisibleParlayValidationModal?: Dispatch<SetStateAction<{ visible: boolean; message: string }>>
}

const MatchListContent: FC<IMatchListContent> = ({ match, setVisibleParlayValidationModal }) => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const { winnerTypeMatch, doubleChanceTypeMatches, spreadTypeMatch, totalTypeMatch, combinedTypeMatch } = match
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(winnerTypeMatch?.tags[0] as any)
	const isPlayingNow = !match.isResolved && !match.homeOdds && !match.awayOdds

	return (
		<SC.PanelContent>
			<SC.SmallMatchContentWrapper>
				{winnerTypeMatch && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>{t('Winner')}</SC.RadioMobileHeader>
						{isPlayingNow ? (
							<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
						) : (
							<SC.RadioMobileGroup>
								<OddButton
									match={match}
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									betOption={BET_OPTIONS.WINNER_HOME}
									oddName={isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_HOME}
									isMobilePanel
								/>
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									betOption={BET_OPTIONS.WINNER_DRAW}
									isMobilePanel
								/>
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									betOption={BET_OPTIONS.WINNER_AWAY}
									isMobilePanel
								/>
							</SC.RadioMobileGroup>
						)}
						<SC.OddsWrapper>
							<OddValue match={match} betOption={BET_OPTIONS.WINNER_HOME} />
							<OddValue match={match} betOption={BET_OPTIONS.WINNER_DRAW} />
							<OddValue match={match} betOption={BET_OPTIONS.WINNER_AWAY} />
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
				{doubleChanceTypeMatches && doubleChanceTypeMatches.length > 0 && !(chain?.id === NETWORK_IDS.OPTIMISM_GOERLI) && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>{t('Double chance')}</SC.RadioMobileHeader>
						{getOddByBetType(match as any, false, BET_OPTIONS.DOUBLE_CHANCE_HOME).formattedOdd === '0' &&
							getOddByBetType(match as any, false, BET_OPTIONS.WINNER_HOME).formattedOdd !== '0' && (
								<SC.WarningText>{t('Coming soon')}</SC.WarningText>
							)}
						{isPlayingNow ? (
							<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
						) : (
							<SC.RadioMobileGroup>
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									betOption={BET_OPTIONS.DOUBLE_CHANCE_HOME}
									isMobilePanel
								/>
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									betOption={BET_OPTIONS.DOUBLE_CHANCE_DRAW}
									isMobilePanel
								/>
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									betOption={BET_OPTIONS.DOUBLE_CHANCE_AWAY}
									isMobilePanel
								/>
							</SC.RadioMobileGroup>
						)}
						<SC.OddsWrapper>
							<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_HOME} />
							<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_DRAW} />
							<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_AWAY} />
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
				{spreadTypeMatch && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>{t('Handicap')}</SC.RadioMobileHeader>
						{isPlayingNow ? (
							<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
						) : (
							<SC.RadioMobileGroup>
								<OddButton
									match={match}
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									betOption={BET_OPTIONS.HANDICAP_HOME}
									oddName={`${BET_OPTIONS.HANDICAP_HOME} (${getHandicapValue(spreadTypeMatch.spread, BET_OPTIONS.HANDICAP_HOME)})`}
									isMobilePanel
								/>
								<OddButton
									match={match}
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									betOption={BET_OPTIONS.HANDICAP_AWAY}
									oddName={`${BET_OPTIONS.HANDICAP_AWAY} (${getHandicapValue(spreadTypeMatch.spread, BET_OPTIONS.HANDICAP_AWAY)})`}
									isMobilePanel
								/>
							</SC.RadioMobileGroup>
						)}
						<SC.OddsWrapper>
							<OddValue match={match} betOption={BET_OPTIONS.HANDICAP_HOME} />
							<OddValue match={match} betOption={BET_OPTIONS.HANDICAP_AWAY} />
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
				{totalTypeMatch && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>{t('Total')}</SC.RadioMobileHeader>
						{isPlayingNow ? (
							<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
						) : (
							<SC.RadioMobileGroup>
								<OddButton
									match={match}
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									betOption={BET_OPTIONS.TOTAL_OVER}
									oddName={`${BET_OPTIONS.TOTAL_OVER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
									isMobilePanel
								/>
								<OddButton
									match={match}
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									betOption={BET_OPTIONS.TOTAL_UNDER}
									oddName={`${BET_OPTIONS.TOTAL_UNDER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
									isMobilePanel
								/>
							</SC.RadioMobileGroup>
						)}
						<SC.OddsWrapper>
							<OddValue match={match} betOption={BET_OPTIONS.TOTAL_OVER} />
							<OddValue match={match} betOption={BET_OPTIONS.TOTAL_UNDER} />
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
				{combinedTypeMatch && totalTypeMatch && (
					<SC.MobileWrapper>
						<SC.RadioMobileHeader>{t('Combined')}</SC.RadioMobileHeader>
						{isPlayingNow ? (
							<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
						) : (
							<SC.RadioMobileGroup>
								{/* // 1O */}
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									isMobilePanel
									betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER}
									oddName={`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
								/>
								{/* 1U */}
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									isMobilePanel
									betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER}
									oddName={`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
								/>
								{/* 2O */}
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									isMobilePanel
									betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER}
									oddName={`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER[0]} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
								/>
								{/* 2U */}
								<OddButton
									setVisibleParlayValidationModal={setVisibleParlayValidationModal}
									match={match}
									isMobilePanel
									betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER}
									oddName={`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER[0]} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
								/>
							</SC.RadioMobileGroup>
						)}
						<SC.OddsWrapper>
							<OddValue match={match} betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER} />
							<OddValue match={match} betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER} />
							<OddValue match={match} betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER} />
							<OddValue match={match} betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER} />
						</SC.OddsWrapper>
					</SC.MobileWrapper>
				)}
			</SC.SmallMatchContentWrapper>
			{/* // Desktop */}
			<SC.ExtendedMatchContentWrapper>
				{winnerTypeMatch && (
					// 1, X, 2
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Winner')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							{isPlayingNow ? (
								<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
							) : (
								<SC.ExtendedMatchContentRadioButtonGroup>
									<OddButton
										match={match}
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										betOption={BET_OPTIONS.WINNER_HOME}
										oddName={isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_HOME}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.WINNER_DRAW}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.WINNER_AWAY}
									/>
								</SC.ExtendedMatchContentRadioButtonGroup>
							)}
							<SC.ExtendedOddsWrapper>
								<OddValue match={match} betOption={BET_OPTIONS.WINNER_HOME} />
								<OddValue match={match} betOption={BET_OPTIONS.WINNER_DRAW} />
								<OddValue match={match} betOption={BET_OPTIONS.WINNER_AWAY} />
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{doubleChanceTypeMatches && doubleChanceTypeMatches.length > 0 && !(chain?.id === NETWORK_IDS.OPTIMISM_GOERLI) && (
					// 1X, 12, X2
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Double chance')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							{getOddByBetType(match as any, false, BET_OPTIONS.DOUBLE_CHANCE_HOME).formattedOdd === '0' &&
								getOddByBetType(match as any, false, BET_OPTIONS.WINNER_HOME).formattedOdd !== '0' && (
									<SC.WarningText>{t('Coming soon')}</SC.WarningText>
								)}
							{isPlayingNow ? (
								<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
							) : (
								<SC.ExtendedMatchContentRadioButtonGroup>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.DOUBLE_CHANCE_HOME}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.DOUBLE_CHANCE_DRAW}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.DOUBLE_CHANCE_AWAY}
									/>
								</SC.ExtendedMatchContentRadioButtonGroup>
							)}
							<SC.ExtendedOddsWrapper>
								<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_HOME} />
								<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_DRAW} />
								<OddValue match={match} betOption={BET_OPTIONS.DOUBLE_CHANCE_AWAY} />
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{spreadTypeMatch && (
					// H1, H2
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Handicap')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							{isPlayingNow ? (
								<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
							) : (
								<SC.ExtendedMatchContentRadioButtonGroup>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.HANDICAP_HOME}
										oddName={`${BET_OPTIONS.HANDICAP_HOME} (${getHandicapValue(spreadTypeMatch.spread, BET_OPTIONS.HANDICAP_HOME)})`}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.HANDICAP_AWAY}
										oddName={`${BET_OPTIONS.HANDICAP_AWAY} (${getHandicapValue(spreadTypeMatch.spread, BET_OPTIONS.HANDICAP_AWAY)})`}
									/>
								</SC.ExtendedMatchContentRadioButtonGroup>
							)}
							<SC.ExtendedOddsWrapper>
								<OddValue match={match} betOption={BET_OPTIONS.HANDICAP_HOME} />
								<OddValue match={match} betOption={BET_OPTIONS.HANDICAP_AWAY} />
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{totalTypeMatch && (
					// O, U
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Total')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							{isPlayingNow ? (
								<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
							) : (
								<SC.ExtendedMatchContentRadioButtonGroup>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.TOTAL_OVER}
										oddName={`${BET_OPTIONS.TOTAL_OVER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.TOTAL_UNDER}
										oddName={`${BET_OPTIONS.TOTAL_UNDER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
									/>
								</SC.ExtendedMatchContentRadioButtonGroup>
							)}
							<SC.ExtendedOddsWrapper>
								<OddValue match={match} betOption={BET_OPTIONS.TOTAL_OVER} />
								<OddValue match={match} betOption={BET_OPTIONS.TOTAL_UNDER} />
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
				{combinedTypeMatch && totalTypeMatch && (
					// 1O, 1U, 2O, 2U
					<SC.ExtendedMatchContentItemCol>
						<SC.ExtendedMatchContentItemHeader>{t('Combined')}</SC.ExtendedMatchContentItemHeader>
						<SC.ExtendedRowItemContent>
							{isPlayingNow ? (
								<SC.NotAvailableText>{t('Currently not available')}</SC.NotAvailableText>
							) : (
								<SC.ExtendedMatchContentRadioButtonGroup>
									{/* // 1O */}
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER}
										oddName={`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
									/>
									{/* 1U */}
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER}
										oddName={`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
									/>
									{/* 2O */}
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER}
										oddName={`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
									/>
									{/* 2U */}
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										match={match}
										betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER}
										oddName={`${BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER} (${roundToTwoDecimals(totalTypeMatch.total || 0)})`}
									/>
								</SC.ExtendedMatchContentRadioButtonGroup>
							)}
							<SC.ExtendedOddsWrapper>
								<OddValue match={match} betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_OVER} />
								<OddValue match={match} betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_HOME_UNDER} />
								<OddValue match={match} betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_OVER} />
								<OddValue match={match} betOption={BET_OPTIONS.COMBINED_WINNER_AND_TOTAL_AWAY_UNDER} />
							</SC.ExtendedOddsWrapper>
						</SC.ExtendedRowItemContent>
					</SC.ExtendedMatchContentItemCol>
				)}
			</SC.ExtendedMatchContentWrapper>
		</SC.PanelContent>
	)
}

export default MatchListContent
