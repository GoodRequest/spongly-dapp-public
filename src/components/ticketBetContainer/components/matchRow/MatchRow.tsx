import { Col, Row, Tooltip } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { FC, useMemo, useState } from 'react'
import { toNumber } from 'lodash'

// components
import Modal from '../../../modal/Modal'
import MatchListContent from '../../../matchesList/MatchListContent'

// utils
import { getTeamImageSource } from '@/utils/images'
import { getOddByBetType, isWindowReady } from '@/utils/helpers'
import { NO_TEAM_IMAGE_FALLBACK, OddsType, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { getPossibleBetOptions } from '@/utils/markets'

// redux
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'

// styles
import * as SC from './MatchRowStyles'
import * as PSC from '../../TicketBetContainerStyles'
import * as SCS from '@/styles/GlobalStyles'
// icons
import TrashIcon from '@/assets/icons/close-circle.svg'

interface IMatchRow {
	match: TicketPosition // TODO: change to IMatch type and remove TicketPosition type accross the app
	readOnly?: boolean
	deleteHandler?: (position: TicketPosition) => void
}

const MatchRow: FC<IMatchRow> = ({ match, deleteHandler, readOnly }) => {
	const { t } = useTranslation()
	const [modalOpen, setModalOpen] = useState(false)
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(match?.winnerTypeMatch?.tags[0] as any)
	const actualOddType = isWindowReady() ? (localStorage.getItem('oddType') as OddsType) || OddsType.DECIMAL : OddsType.DECIMAL

	const [teamImages] = useState({
		awayTeam: getTeamImageSource(match?.awayTeam || '', toNumber(match?.tags?.[0])),
		homeTeam: getTeamImageSource(match?.homeTeam || '', toNumber(match?.tags?.[0]))
	})

	const images = useMemo(
		() => (
			<>
				<SCS.MatchIcon $imgSize={28} style={{ marginLeft: '0px' }}>
					<img
						src={teamImages.homeTeam}
						alt={match.homeTeam}
						onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
							e.target.src = NO_TEAM_IMAGE_FALLBACK
						}}
					/>
				</SCS.MatchIcon>
				{!isTotalWinner && (
					<SCS.MatchIcon $imgSize={28}>
						<img
							src={teamImages.awayTeam}
							alt={match.awayTeam}
							onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
								e.target.src = NO_TEAM_IMAGE_FALLBACK
							}}
						/>
					</SCS.MatchIcon>
				)}
			</>
		),
		[isTotalWinner, match, teamImages]
	)

	return (
		<>
			<SC.MatchRow gutter={[0, 0]} readOnly={readOnly}>
				<Col xs={readOnly ? 16 : 14} sm={readOnly ? 18 : 16} md={readOnly ? 18 : 14} xl={readOnly ? 18 : 14}>
					<SC.StartCenteredRow>
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
					<SC.MatchOdd>{getOddByBetType(match as any, actualOddType).formattedOdd}</SC.MatchOdd>
					{!readOnly && (
						<SC.BonusText hide={getOddByBetType(match as any, actualOddType).rawBonus <= 0}>
							{getOddByBetType(match as any, actualOddType).formattedBonus}
						</SC.BonusText>
					)}
				</SC.OddCol>
				{deleteHandler && (
					<SC.RemoveButtonWrapper>
						<Tooltip title={t('Remove')} placement={'left'}>
							<PSC.DeleteButton disabled={!deleteHandler} type={'button'} onClick={() => deleteHandler(match)} icon={TrashIcon} />
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
				<Row>
					<SC.MatchIcons>
						<SCS.MatchIcon>
							<img
								src={teamImages.homeTeam}
								alt={match.homeTeam}
								onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
									e.target.src = NO_TEAM_IMAGE_FALLBACK
								}}
							/>
						</SCS.MatchIcon>
						<SCS.MatchIcon>
							<img
								src={teamImages.awayTeam}
								alt={match.awayTeam}
								onError={(e: React.SyntheticEvent<HTMLImageElement, Event> | any) => {
									e.target.src = NO_TEAM_IMAGE_FALLBACK
								}}
							/>
						</SCS.MatchIcon>
					</SC.MatchIcons>
					<SC.MatchNames>
						<SC.TeamName>{match.homeTeam}</SC.TeamName>
						<SC.TeamName>{match.awayTeam}</SC.TeamName>
					</SC.MatchNames>
				</Row>
				<PSC.MatchBetOptionsWrapper>
					<MatchListContent match={match as any} />
				</PSC.MatchBetOptionsWrapper>
			</Modal>
		</>
	)
}

export default MatchRow
