import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useAccount, useNetwork, useProvider, useSigner, useSwitchNetwork } from 'wagmi'
import { useEffect, useState } from 'react'

// utils
import { useRouter } from 'next-translate-routes'
import { MSG_TYPE, NETWORK_IDS, NOTIFICATION_TYPE } from '@/utils/constants'
import { getWalletImage } from '@/utils/images'
import { hasEthereumInjected, NETWORK_SWITCHER_SUPPORTED_NETWORKS } from '@/utils/network'
import networkConnector, { NetworkId } from '@/utils/networkConnector'
import { showNotifications } from '@/utils/tsxHelpers'
import { formatAddress } from '@/utils/formatters/string'

// components
import Modal from '@/components/modal/Modal'

// hooks
import { useIsMounted } from '@/hooks/useIsMounted'

import * as SC from './ConnectButtonStyles'
import * as SCS from '@/components/copyTicketButton/CopyTicketButtonStyles'
import * as SCG from '@/styles/GlobalStyles'

// assets
import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'
import OptimismIcon from '@/assets/icons/optimism-icon.svg'
import BaseIcon from '@/assets/icons/base-icon.svg'
import ArbitrumIcon from '@/assets/icons/arbitrum-icon.svg'

const ConnectButton = () => {
	const { t } = useTranslation()

	const isMounted = useIsMounted()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const { data: signer } = useSigner()
	const provider = useProvider({ chainId: chain?.id || NETWORK_IDS.OPTIMISM })
	const router = useRouter()

	const { switchNetwork } = useSwitchNetwork()

	const [isModalVisible, setIsModalVisible] = useState(false)

	useEffect(() => {
		networkConnector.setNetworkSettings({
			networkId: (chain?.id as NetworkId) || NETWORK_IDS.OPTIMISM,
			provider,
			signer: signer || undefined
		})
		// NOTE: prevent for detail pages (if user is on detail and then change network detail is not the same for every network and throw error)
		router.push('/')
		// TODO: what else shoult we do after change network to prevent errors? (destroy form?!)
	}, [signer, provider, chain?.id])

	const handleSwitchNetwork = async (network: any) => {
		try {
			if (chain?.id !== network.chainId) {
				if (hasEthereumInjected()) {
					await (window.ethereum as any).request({
						// TODO: zisti preco nefunguje ak je zapnuty coinbase extension v Chrome
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: network.networkId }]
					})
					switchNetwork?.(network.networkId)
				} else {
					switchNetwork?.(network.networkId)
				}
				setIsModalVisible(false)
			} else {
				showNotifications(
					[{ type: MSG_TYPE.INFO, message: t('Already on {{ networkName }} network', { networkName: network.shortChainName }) }],
					NOTIFICATION_TYPE.NOTIFICATION
				)
			}
		} catch (e) {
			const err: any = e
			// NOTE: 4001 = rejected request
			if (err?.code === 4001) {
				showNotifications([{ type: MSG_TYPE.INFO, message: err?.message }], NOTIFICATION_TYPE.NOTIFICATION)
			} else {
				showNotifications([{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to switch network') }], NOTIFICATION_TYPE.NOTIFICATION)
			}
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	// TODO: delete this code
	// const handleSwitchNetwork = async (network: any) => {
	// 	console.log('network', network)
	// 	if (chain?.id !== network.networkId) {
	// 		if (hasEthereumInjected()) {
	// 			try {
	// 				await (window.ethereum as any).request({
	// 					method: 'wallet_switchEthereumChain',
	// 					params: [{ chainId: network.networkId }]
	// 				})
	// 				switchNetwork?.(network.networkId)
	// 				setIsModalVisible(false)
	// 			} catch (switchError: any) {
	// 				// NOTE: the requested chain hasn't been added
	// 				if (switchError.code === 4902) {
	// 					try {
	// 						await (window.ethereum as any).request({
	// 							method: 'wallet_addEthereumChain',
	// 							params: [SUPPORTED_NETWORKS_DESCRIPTIONS[+network.chainId]]
	// 						})
	// 						await (window.ethereum as any).request({
	// 							method: 'wallet_switchEthereumChain',
	// 							params: [{ chainId: network.networkId }]
	// 						})
	// 					} catch (addError) {
	// 						// eslint-disable-next-line no-console
	// 						console.log(addError)
	// 						showNotifications(
	// 							[{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to connect your wallet') }],
	// 							NOTIFICATION_TYPE.NOTIFICATION
	// 						)
	// 					}
	// 				} else {
	// 					// eslint-disable-next-line no-console
	// 					console.log(switchError)
	// 					showNotifications(
	// 						[{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to connect your wallet') }],
	// 						NOTIFICATION_TYPE.NOTIFICATION
	// 					)
	// 				}
	// 			}
	// 		} else {
	// 			switchNetwork?.(network.networkId)
	// 			setIsModalVisible(false)
	// 		}
	// 	}
	// }
	const getActualNetworkIcon = () => {
		if (chain?.id === NETWORK_IDS.OPTIMISM) {
			return OptimismIcon
		}
		if (chain?.id === NETWORK_IDS.BASE) {
			return BaseIcon
		}
		if (chain?.id === NETWORK_IDS.ARBITRUM) {
			return ArbitrumIcon
		}
		return OptimismIcon
	}
	return (
		<>
			<Modal open={isModalVisible} onCancel={() => setIsModalVisible(false)} centered>
				<SCS.ModalTitle>{t('Switch network')}</SCS.ModalTitle>
				{NETWORK_SWITCHER_SUPPORTED_NETWORKS.map((network) => (
					<SC.ChainOptions>
						<SC.ChainRow onClick={() => handleSwitchNetwork(network)} justify={'space-between'}>
							<Col span={12}>
								<SC.ChainName style={{ marginBottom: '0px' }}>{network.shortChainName}</SC.ChainName>
							</Col>
							<Col flex={'end'}>
								<SCG.FlexRow>
									{chain?.id === network.chainId && <SC.Connected>{t('connected')}</SC.Connected>}
									<SC.Logo alt={'network-icon'} src={network.icon} />
								</SCG.FlexRow>
							</Col>
						</SC.ChainRow>
					</SC.ChainOptions>
				))}
			</Modal>
			<RainbowConnectButton.Custom>
				{({ account, chain, openConnectModal, openAccountModal, mounted }) => {
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
										<SC.WalletCol flex={'80px'} onClick={() => setIsModalVisible(true)}>
											<SC.WalletRow justify={'space-between'}>
												{/* empty alt text for decorative img */}
												<Col flex={'auto'} style={{ padding: '0px 0px 0px 8px' }}>
													<SC.Logo alt={'optimism'} src={getActualNetworkIcon()} />
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
		</>
	)
}

export default ConnectButton
