import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi'
import { useEffect, useState } from 'react'

// utils
import { formatAddress } from '@/utils/helpers'
import { NETWORK_IDS } from '@/utils/constants'
import { getWalletImage } from '@/utils/images'
import networkConnector, { NetworkId } from '@/utils/networkConnector'

// hooks
import { useIsMounted } from '@/hooks/useIsMounted'

import * as SC from './ConnectButtonStyles'

// components, assets
import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'

const ConnectButton = () => {
	const { t } = useTranslation()

	const isMounted = useIsMounted()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const { data: signer } = useSigner()
	const provider = useProvider({ chainId: chain?.id || NETWORK_IDS.OPTIMISM })

	const [, setIsWalletReady] = useState<boolean>(false)

	useEffect(() => {
		networkConnector.setNetworkSettings({
			networkId: (chain?.id as NetworkId) || NETWORK_IDS.OPTIMISM,
			provider,
			signer: signer || undefined
		})
		setIsWalletReady(true)
	}, [signer, provider, chain?.id])

	return (
		<RainbowConnectButton.Custom>
			{({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
				const connected = mounted && account && chain
				return (
					<div
						{...(!mounted && {
							'aria-hidden': true,
							style: {
								opacity: 0,
								pointerEvents: 'none',
								userSelect: 'none',
								width: '270px'
							}
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<SC.ConnectWrapper>
										<SC.ConnectContainer>
											<SC.Info onClick={openConnectModal}>{t('Connect Wallet')}</SC.Info>
										</SC.ConnectContainer>
									</SC.ConnectWrapper>
								)
							}

							return (
								<Row>
									<SC.WalletCol flex={'80px'} onClick={openChainModal}>
										<SC.WalletRow justify={'space-between'}>
											{/* empty alt text for decorative img */}
											<Col flex={'auto'} style={{ padding: '0px 0px 0px 8px' }}>
												{chain?.hasIcon && <SC.Logo alt={''} src={chain?.iconUrl} />}
											</Col>
											<Col flex={'24px'}>
												<SC.ArrowLogo src={ArrowDownIcon} />
											</Col>
										</SC.WalletRow>
									</SC.WalletCol>
									<SC.AccountModalButton flex={'auto'}>
										<SC.WalletRow onClick={openAccountModal}>
											<Col flex={'24px'}>
												<SC.Logo alt={'addressLogo'} src={getWalletImage(address || '')} style={{ marginRight: '8px' }} />
											</Col>
											<Col flex={'auto'}>{isMounted && <SC.AddressInfo>{formatAddress(address)}</SC.AddressInfo>}</Col>
											<Col flex={'24px'}>
												<SC.ArrowLogo src={ArrowDownIcon} />
											</Col>
										</SC.WalletRow>
									</SC.AccountModalButton>
								</Row>
							)
						})()}
					</div>
				)
			}}
		</RainbowConnectButton.Custom>
	)
}

export default ConnectButton
