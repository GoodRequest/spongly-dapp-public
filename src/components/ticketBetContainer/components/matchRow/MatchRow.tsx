import { useSelector } from 'react-redux'
import { Col, Tooltip } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { FC, useMemo, useState } from 'react'
import { toNumber } from 'lodash'
import { getFormValues } from 'redux-form'

// components
import { useRouter } from 'next-translate-routes'
import Modal from '../../../modal/Modal'
import MatchListContent from '../../../matchesList/MatchListContent'

// utils
import { getTeamImageSource } from '@/utils/images'
import { FORM, PAGES } from '@/utils/enums'
import { getOddByBetType } from '@/utils/helpers'
import { NO_TEAM_IMAGE_FALLBACK, OddsType, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { getPossibleBetOptions } from '@/utils/markets'

// redux
import { IUnsubmittedBetTicket, TicketPosition } from '@/redux/betTickets/betTicketTypes'

// styles
import * as SC from './MatchRowStyles'
import * as SCS from '../../TicketBetContainerStyles'

// icons
import TrashIcon from '@/assets/icons/close-circle.svg'

interface IMatchRow {
	match: TicketPosition // TODO: change to IMatch type and remove TicketPosition type accross the app
	readOnly?: boolean
	deleteHandler?: (position: TicketPosition) => void
	copied?: boolean
}

const MatchRow: FC<IMatchRow> = ({ match, deleteHandler, copied, readOnly }) => {
	const { t } = useTranslation()
	const [modalOpen, setModalOpen] = useState(false)
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(match?.winnerTypeMatch?.tags[0] as any)
	const formValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const router = useRouter()
	const actualOddType = typeof window !== 'undefined' ? (localStorage.getItem('oddType') as OddsType) : OddsType.DECIMAL
	const [teamImages] = useState({
		awayTeam: getTeamImageSource(match?.awayTeam || '', toNumber(match?.tags?.[0])),
		homeTeam: getTeamImageSource(match?.homeTeam || '', toNumber(match?.tags?.[0]))
	})

	const images = useMemo(
		() => (
			<>
				<SC.MatchIcon style={{ marginLeft: '0px' }}>
					<img
						src={teamImages.homeTeam}
						alt={match.homeTeam}
						onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
							e.target.src = NO_TEAM_IMAGE_FALLBACK
						}}
					/>
				</SC.MatchIcon>
				{!isTotalWinner && (
					<SC.MatchIcon>
						<img
							src={teamImages.awayTeam}
							alt={match.awayTeam}
							onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
								e.target.src = NO_TEAM_IMAGE_FALLBACK
							}}
						/>
					</SC.MatchIcon>
				)}
			</>
		),
		[isTotalWinner, match, teamImages]
	)

	return (
		<>
			<SC.MatchRow gutter={[0, 0]} readOnly={readOnly}>
				<Col xs={readOnly ? 16 : 14} sm={readOnly ? 18 : 16} md={readOnly ? 18 : 14} xl={readOnly ? 18 : 14}>
					<SC.StartCenteredRow onClick={() => router.push(`/${PAGES.MATCHES}/?id=${match.gameId}`)}>
						<SC.TeamImages>{images}</SC.TeamImages>
						<SC.TeamNames>
							<SC.TeamName>{match.homeTeam}</SC.TeamName>
							{!isTotalWinner && <SC.TeamName>{match.awayTeam}</SC.TeamName>}
						</SC.TeamNames>
					</SC.StartCenteredRow>
				</Col>
				<Col xs={3} sm={3} md={3}>
					<SC.BetOptionButton type={'primary'} disabled={getPossibleBetOptions(match)?.length <= 1} onClick={() => setModalOpen(true)}>
						{match.betOption}
					</SC.BetOptionButton>
				</Col>
				<SC.OddCol xs={5} sm={3} md={readOnly ? 3 : 5} xl={readOnly ? 3 : 5}>
					<SC.MatchOdd>{getOddByBetType(match as any, copied ? true : !!formValues.copied, actualOddType).formattedOdd}</SC.MatchOdd>
					{!readOnly && (
						<SC.BonusText hide={getOddByBetType(match as any, copied ? true : !!formValues.copied, actualOddType).rawBonus <= 0}>
							{getOddByBetType(match as any, copied ? true : !!formValues.copied, actualOddType).formattedBonus}
						</SC.BonusText>
					)}
				</SC.OddCol>
				{deleteHandler && (
					<SC.RemoveButtonWrapper>
						<Tooltip title={t('Remove')} placement={'left'}>
							<SCS.DeleteButton disabled={!deleteHandler} type={'button'} onClick={() => deleteHandler(match)} icon={TrashIcon} />
						</Tooltip>
					</SC.RemoveButtonWrapper>
				)}
			</SC.MatchRow>
			<Modal
				open={modalOpen}
				onCancel={() => {
					setModalOpen(false)
				}}
				width={800}
				centered
			>
				<SC.ShiftedRow>
					<SC.MatchIcons>
						<SC.MatchIcon>
							<img
								src={teamImages.homeTeam}
								alt={match.homeTeam}
								onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
									e.target.src = NO_TEAM_IMAGE_FALLBACK
								}}
							/>
						</SC.MatchIcon>
						<SC.MatchIcon>
							<img
								src={teamImages.awayTeam}
								alt={match.awayTeam}
								onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
									e.target.src = NO_TEAM_IMAGE_FALLBACK
								}}
							/>
						</SC.MatchIcon>
					</SC.MatchIcons>
					<SC.MatchNames>
						<SC.TeamName>{match.homeTeam}</SC.TeamName>
						<SC.TeamName>{match.awayTeam}</SC.TeamName>
					</SC.MatchNames>
				</SC.ShiftedRow>
				<SC.ShiftedRow>
					<SCS.MatchBetOptionsWrapper>
						<MatchListContent match={match as any} />
					</SCS.MatchBetOptionsWrapper>
				</SC.ShiftedRow>
			</Modal>
		</>
	)
}

export default MatchRow
