import { includes } from 'lodash'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'next-export-i18n'
import * as SC from '../MatchesListStyles'
import { BET_OPTIONS, MATCHES } from '@/utils/enums'
import OddButton from '@/components/oddButton/OddButton'
import OddValue from '@/components/oddButton/OddValue'
import { BetType } from '@/utils/tags'
import { TOTAL_WINNER_TAGS } from '@/utils/constants'

// redux
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'

interface IMatchListItem {
	match: TicketPosition
	type: MATCHES
	setVisibleTotalWinnerModal: Dispatch<SetStateAction<boolean>>
	getContestedTeams: any
	getBaseBetTypes: any
	formatFinishedResults: any
}

const MatchHeaderMobile = ({
	match,
	type = MATCHES.OPEN,
	setVisibleTotalWinnerModal,
	getContestedTeams,
	getBaseBetTypes,
	formatFinishedResults
}: IMatchListItem) => {
	const { t } = useTranslation()
	const { winnerTypeMatch } = match
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(winnerTypeMatch?.tags[0] as any)

	return (
		<SC.MobileContentWrapper>
			<SC.MatchItemRow type={type} key={`${match.maturityDate}-${MATCHES.OPEN}`}>
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
			{type === MATCHES.PAUSED && (
				<SC.MobileStatusWrapper type={MATCHES.FINISHED}> {match.isPaused ? t('PAUSED') : t('CANCELED')}</SC.MobileStatusWrapper>
			)}
		</SC.MobileContentWrapper>
	)
}

export default MatchHeaderMobile
