import { includes } from 'lodash'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next/router'
import * as SC from '../MatchesListStyles'
import { BET_OPTIONS, MATCHES, PAGES } from '@/utils/enums'
import OddButton from '@/components/oddButton/OddButton'
import OddValue from '@/components/oddButton/OddValue'
import { BetType } from '@/utils/tags'
import { TOTAL_WINNER_TAGS } from '@/utils/constants'

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

const MatchHeaderMobile = ({
	match,
	type = MATCHES.OPEN,
	setVisibleParlayValidationModal,
	getContestedTeams,
	getBaseBetTypes,
	formatFinishedResults
}: IMatchListItem) => {
	const { t } = useTranslation()
	const { winnerTypeMatch } = match
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(winnerTypeMatch?.tags[0] as any)
	const router = useRouter()
	return (
		<SC.MobileContentWrapper>
			<SC.MatchItemRow type={type} key={`${match.maturityDate}-${MATCHES.OPEN}`}>
				<SC.MatchItemCol onClick={() => router.push(`/${PAGES.MATCH_DETAIL}/?id=${match.gameId}`)} $alignItems={'flex-start'} span={24}>
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
							setVisibleParlayValidationModal={setVisibleParlayValidationModal}
							betOption={BET_OPTIONS.WINNER_HOME}
							oddName={isTotalWinner ? t('YES') : BET_OPTIONS.WINNER_HOME}
							isMobilePanel
						/>
						<OddButton
							setVisibleParlayValidationModal={setVisibleParlayValidationModal}
							isHeader
							match={match}
							betOption={BET_OPTIONS.WINNER_DRAW}
							isMobilePanel
						/>
						<OddButton
							setVisibleParlayValidationModal={setVisibleParlayValidationModal}
							isHeader
							match={match}
							betOption={BET_OPTIONS.WINNER_AWAY}
							isMobilePanel
						/>
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
