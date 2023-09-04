import { Col, Row } from 'antd'

import { ParlayLeaderboardItem } from '@/typescript/types'
import { formatAddress } from '@/utils/formatters/string'

import * as PSC from '../ParlayLeaderboardStyles'
import * as SC from './ParlayLeaderboardRowStyles'

import BadgeIcon from '@/assets/icons/medal-star.svg'

const ParlayLeaderboardRow = ({ rank, address, position, quote, reward }: ParlayLeaderboardItem) => {
	return (
		<SC.ParlayLeaderboardTableRow align={'middle'}>
			<Col span={9}>
				<Row align={'middle'} wrap={false}>
					<SC.BadgeCol flex={'52px'}>
						<SC.BadgeIcon src={BadgeIcon} />
						<SC.ParlayLeaderboardTableText>{rank}</SC.ParlayLeaderboardTableText>
					</SC.BadgeCol>
					<SC.RankCol flex={'18px'}>
						<SC.ParlayLeaderboardTableText>{rank}</SC.ParlayLeaderboardTableText>
					</SC.RankCol>
					<SC.AddressCol flex={'auto'}>
						<SC.NoWrapDiv>
							<SC.AddressText>{formatAddress(address)}</SC.AddressText>
						</SC.NoWrapDiv>
					</SC.AddressCol>
				</Row>
			</Col>
			<PSC.CenterRowContent span={5}>
				<SC.ParlayLeaderboardTableText>{position}</SC.ParlayLeaderboardTableText>
			</PSC.CenterRowContent>
			<PSC.CenterRowContent span={5}>
				<SC.ParlayLeaderboardTableText>{quote}</SC.ParlayLeaderboardTableText>
			</PSC.CenterRowContent>
			<PSC.CenterRowContent span={5}>
				<SC.ParlayLeaderboardTableText>{reward?.value}</SC.ParlayLeaderboardTableText>
				<SC.NetworkIcon src={reward?.iconUrl} alt={'Network icon'} />
			</PSC.CenterRowContent>
		</SC.ParlayLeaderboardTableRow>
	)
}

export default ParlayLeaderboardRow
