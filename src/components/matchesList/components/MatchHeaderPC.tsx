import { includes } from 'lodash'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useNetwork } from 'wagmi'
import { useRouter } from 'next/router'

import * as SC from '../MatchesListStyles'
import { BET_OPTIONS, MATCHES, PAGES } from '@/utils/enums'
import OddButton from '@/components/oddButton/OddButton'
import OddValue from '@/components/oddButton/OddValue'
import { BetType } from '@/utils/tags'
import { getOddByBetType, isWindowReady } from '@/utils/helpers'
import * as SCS from '@/styles/GlobalStyles'
import { roundToTwoDecimals } from '@/utils/formatters/number'
import { NETWORK_IDS, OddsType, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { formatQuote } from '@/utils/formatters/quote'

// icons
import PauseIcon from '@/assets/icons/pause.svg'
import ClockIcon from '@/assets/icons/clock.svg'
import CanceledIcon from '@/assets/icons/canceled-icon.svg'

// redux
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'

interface IMatchListItem {
	match: TicketPosition
	type: MATCHES
	setVisibleParlayValidationModal: Dispatch<SetStateAction<{ visible: boolean; message: string }>>
	getContestedTeams: any
	getBaseBetTypes: any
	formatFinishedResults: any
}

const MatchHeaderPC = ({
	match,
	type = MATCHES.OPEN,
	setVisibleParlayValidationModal,
	getContestedTeams,
	getBaseBetTypes,
	formatFinishedResults
}: IMatchListItem) => {
	const { t } = useTranslation()
	const { chain } = useNetwork()
	const { winnerTypeMatch, doubleChanceTypeMatches, spreadTypeMatch, totalTypeMatch } = match
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(winnerTypeMatch?.tags[0] as any)
	const isOnlyWinner = winnerTypeMatch && doubleChanceTypeMatches?.length === 0 && !spreadTypeMatch && !totalTypeMatch
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL
	const router = useRouter()
	const getSpanNumber = (betType: BetType) => {
		if (isOnlyWinner) return 15
		if (getBaseBetTypes().length > 2) {
			if (betType === BetType.WINNER && match.drawOdds && Number(match.drawOdds) !== 0) return 7
			return 5
		}
		if (getBaseBetTypes().length === 2) return 8
		return 16
	}

	return (
		<SC.PCContentWrapper>
			{type === MATCHES.OPEN && (
				<SC.MatchItemRow type={type} key={`${match.maturityDate}-${MATCHES.OPEN}`}>
					<SC.MatchItemCol onClick={() => router.push(`/${PAGES.MATCH_DETAIL}/?id=${match.gameId}`)} $alignItems={'flex-start'} span={8}>
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
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										betOption={BET_OPTIONS.WINNER_HOME}
										oddName={isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_HOME}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										isHeader
										match={match}
										betOption={BET_OPTIONS.WINNER_DRAW}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										isHeader
										match={match}
										betOption={BET_OPTIONS.WINNER_AWAY}
									/>
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
								{formatQuote(OddsType.DECIMAL, getOddByBetType(match as any, false, actualOddType, BET_OPTIONS.DOUBLE_CHANCE_HOME).rawOdd) ===
									'0' &&
									formatQuote(OddsType.DECIMAL, getOddByBetType(match as any, false, actualOddType, BET_OPTIONS.WINNER_AWAY).rawOdd) !==
										'0' && <SC.WarningText>{t('Coming soon')}</SC.WarningText>}

								<SC.RowItemContent>
									<SC.RadioGroup>
										<OddButton
											setVisibleParlayValidationModal={setVisibleParlayValidationModal}
											isHeader
											match={match}
											betOption={BET_OPTIONS.DOUBLE_CHANCE_HOME}
										/>
										<OddButton
											setVisibleParlayValidationModal={setVisibleParlayValidationModal}
											isHeader
											match={match}
											betOption={BET_OPTIONS.DOUBLE_CHANCE_DRAW}
										/>
										<OddButton
											setVisibleParlayValidationModal={setVisibleParlayValidationModal}
											isHeader
											match={match}
											betOption={BET_OPTIONS.DOUBLE_CHANCE_AWAY}
										/>
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
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										isHeader
										match={match}
										betOption={BET_OPTIONS.HANDICAP_HOME}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										isHeader
										match={match}
										betOption={BET_OPTIONS.HANDICAP_AWAY}
									/>
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
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										isHeader
										match={match}
										betOption={BET_OPTIONS.TOTAL_OVER}
									/>
									<OddButton
										setVisibleParlayValidationModal={setVisibleParlayValidationModal}
										isHeader
										match={match}
										betOption={BET_OPTIONS.TOTAL_UNDER}
									/>
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
				<SC.MatchItemRow gutter={16} type={MATCHES.ONGOING} key={`${match.maturityDate}-${MATCHES.ONGOING}`}>
					<SC.MatchItemCol onClick={() => router.push(`/${PAGES.MATCH_DETAIL}/?id=${match.gameId}`)} $alignItems={'flex-start'} span={18}>
						{getContestedTeams}
					</SC.MatchItemCol>
					<SC.MatchItemCol span={6}>
						<SC.Header>{t('Status')}</SC.Header>
						<SC.StatusWrapper>
							<SCS.Icon icon={ClockIcon} />
							{t('Ongoing')}
						</SC.StatusWrapper>
					</SC.MatchItemCol>
				</SC.MatchItemRow>
			)}
			{type === MATCHES.FINISHED && (
				<SC.MatchItemRow gutter={16} type={MATCHES.FINISHED} key={`${match.maturityDate}-${MATCHES.FINISHED}`}>
					<SC.MatchItemCol onClick={() => router.push(`/${PAGES.MATCH_DETAIL}/?id=${match.gameId}`)} $alignItems={'flex-start'} span={18}>
						{getContestedTeams}
					</SC.MatchItemCol>
					<SC.MatchItemCol span={6}>
						<SC.Header>{t('Results')}</SC.Header>
						<SC.StatusWrapper>{formatFinishedResults()}</SC.StatusWrapper>
					</SC.MatchItemCol>
				</SC.MatchItemRow>
			)}
			{type === MATCHES.PAUSED && (
				<SC.MatchItemRow gutter={16} type={MATCHES.PAUSED} key={`${match.maturityDate}-${MATCHES.PAUSED}`}>
					<SC.MatchItemCol onClick={() => router.push(`/${PAGES.MATCH_DETAIL}/?id=${match.gameId}`)} $alignItems={'flex-start'} span={18}>
						{getContestedTeams}
					</SC.MatchItemCol>
					<SC.MatchItemCol span={6}>
						<SC.Header>{t('Status')}</SC.Header>
						{match?.isPaused ? (
							<SC.StatusWrapper>
								<SCS.Icon icon={PauseIcon} />
								{t('Paused')}
							</SC.StatusWrapper>
						) : (
							<SC.StatusWrapper>
								<SCS.Icon icon={CanceledIcon} />
								{t('Canceled')}
							</SC.StatusWrapper>
						)}
					</SC.MatchItemCol>
				</SC.MatchItemRow>
			)}
		</SC.PCContentWrapper>
	)
}

export default MatchHeaderPC
