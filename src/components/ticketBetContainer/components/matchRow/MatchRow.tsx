import { useDispatch } from 'react-redux'
import { Col, Select, Tooltip } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { FC, useEffect, useMemo, useState } from 'react'
import { toNumber } from 'lodash'

// components
import { Select as SelectField } from '@/atoms/form/selectField/SelectField'

// utils
import { getTeamImageSource } from '@/utils/images'
import { BET_OPTIONS, DoubleChanceMarketType } from '@/utils/enums'
import { formatQuote } from '@/utils/helpers'
import { NO_TEAM_IMAGE_FALLBACK, OddsType, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { getMatchByBetOption, getOddsPropertyFromBetOption, getPossibleBetOptions } from '@/utils/markets'

// redux
import { updateActiveTicketMatches } from '@/redux/betTickets/betTicketsActions'
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'

// styles
import * as SC from './MatchRowStyles'
import * as SCS from '../../TicketBetContainerStyles'

// icons
import TrashIcon from '@/assets/icons/close-circle.svg'
import Modal from '../../../modal/Modal'
import MatchListContent from '../../../matchesList/MatchListContent'

const { Option } = Select
interface IMatchRow {
	match: TicketPosition
	readOnly?: boolean
	allTicketMatches?: TicketPosition[]
	deleteHandler?: (position: TicketPosition) => void
}

const MatchRow: FC<IMatchRow> = ({ match, allTicketMatches, deleteHandler, readOnly }) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const [modalOpen, setModalOpen] = useState(false)
	const [selectedMatch, setSelectedMatch] = useState(getMatchByBetOption(match.betOption, match))
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(match?.winnerTypeMatch?.tags[0] as any)

	const [teamImages] = useState({
		awayTeam: getTeamImageSource(match?.awayTeam || '', toNumber(match?.tags?.[0])),
		homeTeam: getTeamImageSource(match?.homeTeam || '', toNumber(match?.tags?.[0]))
	})
	const handleChangeBetType = (betOption: BET_OPTIONS) => {
		const selectedBetTypeMarket = getMatchByBetOption(betOption, match)
		dispatch(updateActiveTicketMatches({ ...match, betOption }, allTicketMatches))
		setSelectedMatch(selectedBetTypeMarket)
	}

	useEffect(() => {
		const selectedBetTypeMarket = getMatchByBetOption(match.betOption, match)
		setSelectedMatch(selectedBetTypeMarket)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match.betOption])

	const getOdds = () => {
		if (selectedMatch) {
			if (selectedMatch?.doubleChanceMarketType === DoubleChanceMarketType.NO_DRAW) {
				return formatQuote(OddsType.DECIMAL, selectedMatch.homeOdds)
			}
			return formatQuote(OddsType.DECIMAL, selectedMatch?.[getOddsPropertyFromBetOption(match.betOption)])
		}
		return formatQuote(OddsType.DECIMAL, Number(match?.[getOddsPropertyFromBetOption(match.betOption)]))
	}

	const images = useMemo(() => (
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
	), [isTotalWinner, match, teamImages])

	return (
		<>
			<SC.MatchRow gutter={[0, 0]} readOnly={readOnly}>
				<Col xs={16} sm={18} md={16} xl={14}>
					<SC.StartCenteredRow>
						<SC.TeamImages>
							{images}
						</SC.TeamImages>
						<SC.TeamNames>
							<SC.TeamName>{match.homeTeam}</SC.TeamName>
							{!isTotalWinner && (<SC.TeamName>{match.awayTeam}</SC.TeamName>)}
						</SC.TeamNames>
					</SC.StartCenteredRow>
				</Col>
				<Col xs={3} sm={2} md={0}>
					<SC.BetOptionButton type={'primary'} onClick={() => setModalOpen(true)}>
						{match.betOption}
					</SC.BetOptionButton>
				</Col>
				<Col xs={0} sm={0} md={4} xl={4}>
					<SelectField
						value={match.betOption}
						useBodyAsPopupContainer={true}
						popupClassName={'odds-select'}
						onChange={(betOption: BET_OPTIONS) => handleChangeBetType(betOption)}
						disabled={getPossibleBetOptions(match)?.length <= 1} // NOTE: if has 1 option, it does not need to be active ( total winner )
						options={
							getPossibleBetOptions(match)?.map((betOption, key) => (
								<Option key={`option-${key}`} value={betOption} label={isTotalWinner ? t('YES') : betOption}>
									{isTotalWinner ? t('YES') : betOption}
								</Option>
							)) as any
						}
					/>
				</Col>
				<Col xs={3} sm={2} md={2} xl={4} style={{ display: 'flex', justifyContent: 'center' }}>
					<SC.MatchOdd>{getOdds()}</SC.MatchOdd>
				</Col>
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
				centered
			>
				<SC.ShiftedRow>
					<SC.MatchIcons>
						<SC.MatchIcon>
							<img src={teamImages.homeTeam} alt={match.homeTeam} />
						</SC.MatchIcon>
						<SC.MatchIcon>
							<img src={teamImages.awayTeam} alt={match.awayTeam} />
						</SC.MatchIcon>
					</SC.MatchIcons>
					<SC.MatchNames>
						<SC.TeamName>{match.homeTeam}</SC.TeamName>
						<SC.TeamName>{match.awayTeam}</SC.TeamName>
					</SC.MatchNames>
				</SC.ShiftedRow>
				<SC.ShiftedRow>
					<SCS.MatchBetOptionsWrapper>
						<MatchListContent match={match as any}/>
					</SCS.MatchBetOptionsWrapper>
				</SC.ShiftedRow>
			</Modal>
		</>
	)
}

export default MatchRow
