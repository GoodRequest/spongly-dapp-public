import { Col } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useRouter } from 'next-translate-routes'

import { ParlayLeaderboardTableItem } from '@/typescript/types'
import { formatAddress } from '@/utils/formatters/string'

import * as SC from './ParlayLeaderboardTableRowStyles'

import BadgeIcon from '@/assets/icons/medal-star.svg'
import { PAGES } from '@/utils/enums'

const ParlayLeaderboardTableRow = ({ rank, address, position, quote, paid, won, reward, isLoading = false }: ParlayLeaderboardTableItem) => {
	const { t } = useTranslation()
	const router = useRouter()
	const skeletonPreset = (width: number) => {
		return <SC.StyledSkeleton title={false} active paragraph={{ rows: 1, width }} />
	}

	return (
		<>
			<SC.ParlayLeaderboardTableRow align={'middle'} gutter={[8, 32]}>
				<Col md={{ span: 3, order: 1 }} xs={{ span: 6, order: 1 }}>
					<SC.RankBadge>
						<SC.BadgeIcon src={BadgeIcon} />
						{isLoading ? skeletonPreset(15) : <SC.ParlayLeaderboardTableRankText>{rank}</SC.ParlayLeaderboardTableRankText>}
					</SC.RankBadge>
				</Col>
				<Col md={{ span: 3, order: 1 }} xs={{ span: 12, order: 1 }}>
					{isLoading ? (
						skeletonPreset(120)
					) : (
						// eslint-disable-next-line
						<div
							role={'button'}
							style={{ minWidth: '80px', cursor: 'pointer' }}
							onClick={() => router.push(`/${PAGES.TIPSTER_DETAIL}/?id=${address}`)}
						>
							<SC.ColumnNameText>{t('Wallet')}</SC.ColumnNameText>
							<SC.AddressText>{formatAddress(address)}</SC.AddressText>
						</div>
					)}
				</Col>
				<Col md={{ span: 4, order: 2 }} xs={{ span: 6, order: 6 }}>
					{isLoading ? (
						skeletonPreset(20)
					) : (
						<>
							<SC.ColumnNameText>{t('Positions')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{position}</SC.ParlayLeaderboardTableText>
						</>
					)}
				</Col>
				<Col md={{ span: 4, order: 3 }} xs={{ span: 6, order: 3 }}>
					{isLoading ? (
						skeletonPreset(50)
					) : (
						<>
							<SC.ColumnNameText>{t('Buy-in')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{paid} $</SC.ParlayLeaderboardTableText>
						</>
					)}
				</Col>
				<Col md={{ span: 3, order: 4 }} xs={{ span: 6, order: 4 }}>
					{isLoading ? (
						skeletonPreset(20)
					) : (
						<>
							<SC.ColumnNameText>{t('Quote')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{quote}</SC.ParlayLeaderboardTableText>
						</>
					)}
				</Col>
				<Col md={{ span: 4, order: 5 }} xs={{ span: 6, order: 5 }}>
					{isLoading ? (
						skeletonPreset(50)
					) : (
						<>
							<SC.ColumnNameText>{t('Won')}</SC.ColumnNameText>
							<SC.ParlayLeaderboardTableText>{won} $</SC.ParlayLeaderboardTableText>
						</>
					)}
				</Col>
				<Col md={{ span: 3, order: 6 }} xs={{ span: 6, order: 2 }}>
					{isLoading
						? skeletonPreset(50)
						: reward && (
								<>
									<SC.ColumnNameText>{t('Reward')}</SC.ColumnNameText>
									<SC.ColumnPoints>
										<SC.ParlayLeaderboardTableText>{reward?.value}</SC.ParlayLeaderboardTableText>
										{reward?.iconUrl && <img src={reward?.iconUrl} alt={'Network icon'} />}
									</SC.ColumnPoints>
								</>
						  )}
				</Col>
			</SC.ParlayLeaderboardTableRow>
			<SC.ParlayDivider />
		</>
	)
}

export default ParlayLeaderboardTableRow
