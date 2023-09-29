import { FC, useMemo, Dispatch, SetStateAction, useState } from 'react'
import { includes, toNumber } from 'lodash'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import dynamic from 'next/dynamic'

// utils
import { MATCHES, RESOLUTIONS } from '@/utils/enums'
import { NO_TEAM_IMAGE_FALLBACK, SportFilterEnum, TOTAL_WINNER_TAGS } from '@/utils/constants'
import { getTeamImageSource } from '@/utils/images'
import { getFormatDate } from '@/utils/formatters/string'
import { useMedia } from '@/hooks/useMedia'

// redux
import { TicketPosition } from '@/redux/betTickets/betTicketTypes'

// styles
import * as SC from './MatchesListStyles'
import * as SCS from '@/styles/GlobalStyles'
import { BetType, SPORTS_MAP } from '@/utils/tags'
import MatchHeaderPC from './components/MatchHeaderPC'

const MatchHeaderMobile = dynamic(() => import('./components/MatchHeaderMobile'))

interface IMatchListItem {
	match: TicketPosition
	type: MATCHES
	setVisibleTotalWinnerModal: Dispatch<SetStateAction<boolean>>
}

const MatchListHeader: FC<IMatchListItem> = ({ match, type = MATCHES.OPEN, setVisibleTotalWinnerModal }) => {
	const { t } = useTranslation()
	const size = useMedia()

	const { winnerTypeMatch } = match
	const isTotalWinner = TOTAL_WINNER_TAGS.includes(winnerTypeMatch?.tags[0] as any)
	const [imgSrcHome, setImgSrcHome] = useState<string>(getTeamImageSource(match?.homeTeam || '', toNumber(match?.tags?.[0])))
	const [imgSrcAway, setImgSrcAway] = useState<string>(getTeamImageSource(match?.awayTeam || '', toNumber(match?.tags?.[0])))

	const images = useMemo(
		() => (
			<>
				<SC.TeamImage>
					<img
						src={imgSrcHome}
						alt={match?.homeTeam}
						onError={() => {
							setImgSrcHome(NO_TEAM_IMAGE_FALLBACK)
						}}
					/>
				</SC.TeamImage>
				{!isTotalWinner && (
					<SC.TeamImage>
						<img
							src={imgSrcAway}
							width={30}
							height={30}
							alt={match?.awayTeam}
							onError={() => {
								setImgSrcAway(NO_TEAM_IMAGE_FALLBACK)
							}}
						/>
					</SC.TeamImage>
				)}
			</>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[match, imgSrcHome, imgSrcAway]
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
		() =>
			type === MATCHES.OPEN ? (
				<>
					<SC.Header>{getFormatDate(type, match.maturityDate, t)}</SC.Header>
					{size === RESOLUTIONS.XXL && (
						<SC.XXLWrapper>
							<SC.NoWrapCenterRow gutter={16}>
								<Col span={12}>
									<Row style={{ flexWrap: 'nowrap' }}>{images}</Row>
								</Col>
								<Col span={12}>{teamNames}</Col>
							</SC.NoWrapCenterRow>
						</SC.XXLWrapper>
					)}
					{includes([RESOLUTIONS.SEMIXXL, RESOLUTIONS.XL, RESOLUTIONS.LG], size) ? (
						<SC.SEMIXXLWrapper>
							<Row>{images}</Row>
							<Row>
								<SC.MobileTeamsContent>{teamNames}</SC.MobileTeamsContent>
							</Row>
						</SC.SEMIXXLWrapper>
					) : (
						<SC.MDWrapper>
							<Row gutter={16}>
								<SC.FlexCol isTotalWinner={isTotalWinner}>{images}</SC.FlexCol>
								<SC.FlexCenterCol>{teamNames}</SC.FlexCenterCol>
							</Row>
						</SC.MDWrapper>
					)}
				</>
			) : (
				// ONGOING, PAUSED, FINISHED
				<>
					<SC.Header>{getFormatDate(type, match.maturityDate, t)}</SC.Header>
					{includes([RESOLUTIONS.SEMIXXL, RESOLUTIONS.XL, RESOLUTIONS.LG, RESOLUTIONS.XXL], size) ? (
						<SC.NoWrapCenterRow style={{ width: '100%' }} gutter={16}>
							<Col span={6}>
								<Row style={{ flexWrap: 'nowrap' }}>{images}</Row>
							</Col>
							<Col span={18}>{teamNames}</Col>
						</SC.NoWrapCenterRow>
					) : (
						<SC.MDWrapper>
							<Row gutter={16}>
								<SC.FlexCol isTotalWinner={isTotalWinner}>{images}</SC.FlexCol>
								<SC.FlexCenterCol>{teamNames}</SC.FlexCenterCol>
							</Row>
						</SC.MDWrapper>
					)}
				</>
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[match, size, imgSrcHome, imgSrcAway]
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

	const formatFinishedResults = () => {
		if (isTotalWinner) {
			if (match.winnerTypeMatch?.homeScore === '1') {
				return t('Winner')
			}
			return t('No win')
		}
		return `${match.homeScore || '?'} : ${match.awayScore || '?'}`
	}

	return includes([RESOLUTIONS.LG, RESOLUTIONS.SEMIXXL, RESOLUTIONS.XL, RESOLUTIONS.XXL], size) ? (
		<MatchHeaderPC
			match={match}
			type={type}
			setVisibleTotalWinnerModal={setVisibleTotalWinnerModal}
			getContestedTeams={getContestedTeams}
			getBaseBetTypes={getBaseBetTypes}
			formatFinishedResults={formatFinishedResults}
		/>
	) : (
		<MatchHeaderMobile
			match={match}
			type={type}
			setVisibleTotalWinnerModal={setVisibleTotalWinnerModal}
			getContestedTeams={getContestedTeams}
			getBaseBetTypes={getBaseBetTypes}
			formatFinishedResults={formatFinishedResults}
		/>
	)
}

export default MatchListHeader
