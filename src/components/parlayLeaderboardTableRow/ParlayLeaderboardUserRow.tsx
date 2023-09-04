import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'

import { ParlayLeaderboardTableItem } from '@/typescript/types'
import { formatAddress } from '@/utils/formatters/string'

import * as SC from './ParlayLeaderboardUserRowStyles'

import BadgeIcon from '@/assets/icons/medal-star.svg'

const ParlayLeaderboardUserRow = ({ rank, address, position, quote, paid, won, reward, isLoading = false }: ParlayLeaderboardTableItem) => {
	const { t } = useTranslation()

	const skeletonPreset = (width: number) => {
		return <SC.StyledSkeleton title={false} active paragraph={{ rows: 1, width }} />
	}

	return (
		<>
			<SC.ParlayLeaderboardTableRow>
				<Col md={{ span: 6, order: 1 }} xs={{ span: 16, order: 1 }} style={{ display: 'flex', alignItems: 'center' }}>
					<Row align={'middle'} wrap={false}>
						<SC.BadgeCol flex={'87px'}>
							<SC.BadgeIcon src={BadgeIcon} />
							{isLoading ? skeletonPreset(15) : <SC.ParlayLeaderboardTableText>{rank}</SC.ParlayLeaderboardTableText>}
						</SC.BadgeCol>
						<SC.AddressCol flex={'auto'}>
							{isLoading ? (
								skeletonPreset(120)
							) : (
								<>
									<SC.ColumnNameText>{t('My wallet')}</SC.ColumnNameText>
									<SC.AddressText>{formatAddress(address)}</SC.AddressText>
								</>
							)}
						</SC.AddressCol>
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
				<SC.CenterRowContent md={{ span: 3, order: 3 }} xs={{ span: 6, order: 3 }}>
					{isLoading ? (
						skeletonPreset(50)
					) : (
						<>
							<SC.ColumnNameText>{t('Buy-in')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{paid}$</SC.ParlayLeaderboardTableText>
						</>
					)}
				</SC.CenterRowContent>
				<SC.CenterRowContent md={{ span: 4, order: 4 }} xs={{ span: 6, order: 4 }}>
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
				<SC.CenterRowContent md={{ span: 4, order: 6 }} xs={{ span: 8, order: 2 }}>
					{isLoading ? (
						skeletonPreset(50)
					) : (
						<>
							<SC.ColumnNameText>{t('Reward')}</SC.ColumnNameText>
							<div style={{ display: 'flex', flexDirection: 'row' }}>
								<SC.ParlayLeaderboardTableText>{reward?.value}</SC.ParlayLeaderboardTableText>
								{reward?.iconUrl ? (
									<img src={reward?.iconUrl} style={{ width: '24px', height: '24px', marginLeft: '8px' }} alt={'Network icon'} />
								) : (
									<span>&nbsp;</span>
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

export default ParlayLeaderboardUserRow
