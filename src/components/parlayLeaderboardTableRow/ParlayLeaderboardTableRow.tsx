import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'

import { useRouter } from 'next-translate-routes'
import { ParlayLeaderboardTableItem } from '@/typescript/types'
import { isBellowOrEqualResolution } from '@/utils/helpers'
import { useMedia } from '@/hooks/useMedia'
import { PAGES, RESOLUTIONS } from '@/utils/enums'
import { formatAddress } from '@/utils/formatters/string'

import * as SC from './ParlayLeaderboardTableRowStyles'

import BadgeIcon from '@/assets/icons/medal-star.svg'

const ParlayLeaderboardTableRow = ({ rank, address, position, quote, paid, won, reward, isLoading = false }: ParlayLeaderboardTableItem) => {
	const { t } = useTranslation()
	const size = useMedia()
	const router = useRouter()
	const skeletonPreset = (width: number) => {
		return <SC.StyledSkeleton title={false} active paragraph={{ rows: 1, width }} />
	}

	const rankContent = (
		<>
			<SC.BadgeCol>
				<SC.BadgeIcon src={BadgeIcon} />
				{isLoading ? skeletonPreset(15) : <SC.ParlayLeaderboardTableRankText>{rank}</SC.ParlayLeaderboardTableRankText>}
			</SC.BadgeCol>
			<SC.AddressCol flex={'auto'}>
				{isLoading ? (
					skeletonPreset(120)
				) : (
					<div onClick={() => router.push(`/${PAGES.LEADERBOARD}/?id=${address}`)} style={{ minWidth: '80px', cursor: 'pointer' }}>
						<SC.ColumnNameText>{t('Wallet')}</SC.ColumnNameText>
						<SC.AddressText>{formatAddress(address)}</SC.AddressText>
					</div>
				)}
			</SC.AddressCol>
		</>
	)

	return (
		<>
			<SC.ParlayLeaderboardTableRow align={'middle'}>
				<Col md={{ span: 6, order: 1 }} xs={{ span: 18, order: 1 }}>
					<Row align={'middle'} justify={'start'} wrap={false}>
						{isBellowOrEqualResolution(size, RESOLUTIONS.MD) ? <SC.CenterDiv>{rankContent}</SC.CenterDiv> : rankContent}
					</Row>
				</Col>
				<SC.CenterRowContent md={{ span: 3, order: 2 }} xs={{ span: 6, order: 6 }}>
					{isLoading ? (
						skeletonPreset(20)
					) : (
						<>
							<SC.ColumnNameText>{t('Positions')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{position}</SC.ParlayLeaderboardTableText>
						</>
					)}
				</SC.CenterRowContent>
				<SC.CenterRowContent md={{ span: 4, order: 3 }} xs={{ span: 6, order: 3 }}>
					{isLoading ? (
						skeletonPreset(50)
					) : (
						<>
							<SC.ColumnNameText>{t('Buy-in')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{paid} $</SC.ParlayLeaderboardTableText>
						</>
					)}
				</SC.CenterRowContent>
				<SC.CenterRowContent md={{ span: 3, order: 4 }} xs={{ span: 6, order: 4 }}>
					{isLoading ? (
						skeletonPreset(20)
					) : (
						<>
							<SC.ColumnNameText>{t('Quote')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{quote}</SC.ParlayLeaderboardTableText>
						</>
					)}
				</SC.CenterRowContent>
				<SC.CenterRowContent md={{ span: 4, order: 5 }} xs={{ span: 6, order: 5 }}>
					{isLoading ? (
						skeletonPreset(50)
					) : (
						<>
							<SC.ColumnNameText>{t('Won')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{won}$</SC.ParlayLeaderboardTableText>
						</>
					)}
				</SC.CenterRowContent>
				<SC.CenterRowContent md={{ span: 4, order: 6 }} xs={{ span: 6, order: 2 }}>
					{isLoading
						? skeletonPreset(50)
						: reward && (
								<>
									<SC.ColumnNameText>{t('Reward')}</SC.ColumnNameText>
									<div style={{ display: 'flex', flexDirection: 'row' }}>
										<SC.ParlayLeaderboardTableText>{reward?.value}</SC.ParlayLeaderboardTableText>
										{reward?.iconUrl && (
											<img src={reward?.iconUrl} style={{ width: '24px', height: '24px', marginLeft: '8px' }} alt={'Network icon'} />
										)}
									</div>
								</>
						  )}
				</SC.CenterRowContent>
			</SC.ParlayLeaderboardTableRow>
			<SC.ParlayDivider />
		</>
	)
}

export default ParlayLeaderboardTableRow
