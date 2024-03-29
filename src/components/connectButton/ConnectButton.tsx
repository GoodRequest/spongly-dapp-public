import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Col, Row } from 'antd'
import { useTranslation } from 'next-export-i18n'
import { useAccount, useNetwork, useProvider, useSigner, useSwitchNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { useRouter } from 'next-translate-routes'
import { useDispatch } from 'react-redux'
import { change } from 'redux-form'

// utils
import { includes } from 'lodash'
import { FORM, MSG_TYPE, NETWORK_IDS, NOTIFICATION_TYPE } from '@/utils/constants'
import { getWalletImage } from '@/utils/images'
import { hasEthereumInjected, NETWORK_SWITCHER_SUPPORTED_NETWORKS } from '@/utils/network'
import networkConnector, { NetworkId } from '@/utils/networkConnector'
import { showNotifications } from '@/utils/tsxHelpers'
import { formatAddress } from '@/utils/formatters/string'
import { PAGES } from '@/utils/enums'

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
import { ACTIVE_TICKET_ID, UNSUBMITTED_BET_TICKETS } from '@/redux/betTickets/betTicketTypes'

const ConnectButton = () => {
	const { t } = useTranslation()

	const isMounted = useIsMounted()
	const { address } = useAccount()
	const { chain } = useNetwork()
	const { data: signer } = useSigner()
	const provider = useProvider({ chainId: chain?.id || NETWORK_IDS.OPTIMISM })
	const router = useRouter()
	const dispatch = useDispatch()

	const { switchNetwork } = useSwitchNetwork()

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [chainId, setChainId] = useState<number | undefined>(chain?.id)

	useEffect(() => {
		networkConnector.setNetworkSettings({
			networkId: (chain?.id as NetworkId) || NETWORK_IDS.OPTIMISM,
			provider,
			signer: signer || undefined
		})
		if (chain?.id !== chainId) {
			// NOTE: prevent for detail pages (if user is on detail and then change network detail is not the same for every network and throw error)
			if (includes([`/${PAGES.TIPSTER_DETAIL}`, `/${PAGES.TICKET_DETAIL}`, `/${PAGES.MATCH_DETAIL}`], router.pathname)) {
				router.push(`/${PAGES.DASHBOARD}`)
			}
			setChainId(chain?.id)
		}

		// Reset bet container form
		dispatch({ type: UNSUBMITTED_BET_TICKETS.UNSUBMITTED_BET_TICKETS_INIT, payload: { data: [{ id: 1, matches: [], copied: false }] } })
		dispatch(change(FORM.BET_TICKET, 'matches', []))
		dispatch({ type: ACTIVE_TICKET_ID.SET, payload: 1 })
		setIsModalVisible(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					switchNetwork?.(network.chainId)
				} else {
					switchNetwork?.(network.chainId)
				}

				setIsModalVisible(false)
			} else {
				showNotifications(
					[{ type: MSG_TYPE.INFO, message: t('Already on {{ networkName }} network', { networkName: network.chainName }) }],
					NOTIFICATION_TYPE.NOTIFICATION
				)
			}
		} catch (e) {
			const err: any = e
			if (err.code === 4902) {
				// Handle MetaMask specific error (if using MetaMask)
				// This code block will not execute for other wallets like Raby
				try {
					if (window.ethereum) {
						await (window.ethereum as any).request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainId: network.networkId,
									chainName: network.chainName,
									rpcUrls: network.rpcUrls,
									blockExplorerUrls: network.blockExplorerUrls,
									iconUrls: network.iconUrls,
									nativeCurrency: {
										symbol: network.nativeCurrency.symbol,
										decimals: network.nativeCurrency.decimals
									}
								}
							]
						})
					}
				} catch (addError: any) {
					if (addError.code === 4001) {
						showNotifications([{ type: MSG_TYPE.INFO, message: t('User rejected transaction') }], NOTIFICATION_TYPE.NOTIFICATION)
					} else {
						showNotifications(
							[{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to switch network') }],
							NOTIFICATION_TYPE.NOTIFICATION
						)
					}
					// Handle error adding network
				}
			} else if (err.code === 4001) {
				// Handle error code 4001 (e.g., rejected request)
				showNotifications([{ type: MSG_TYPE.INFO, message: err?.message }], NOTIFICATION_TYPE.NOTIFICATION)
			} else {
				// Handle other errors (including errors from Raby or other wallets)
				// Check if the error message indicates a missing network
				// eslint-disable-next-line no-lonely-if
				if (err.message && err.message.includes('network')) {
					// Display a generic error message indicating the network is missing
					showNotifications(
						[
							{
								type: MSG_TYPE.WARNING,
								message: t('Unrecognized chain ID. Please add {{ networkName }} network to your wallet', {
									networkName: network.chainName
								})
							}
						],
						NOTIFICATION_TYPE.NOTIFICATION
					)
				} else {
					// Handle other errors not related to missing network or rejected request
					// Display an appropriate error message or take necessary action
					showNotifications(
						[{ type: MSG_TYPE.ERROR, message: t('An error occurred while trying to switch network') }],
						NOTIFICATION_TYPE.NOTIFICATION
					)
				}
			}
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

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
					<SC.ChainOptions key={network.networkId}>
						<SC.ChainRow onClick={() => handleSwitchNetwork(network)} justify={'space-between'}>
							<Col span={12}>
								<SC.ChainName style={{ marginBottom: '0px' }}>{network.chainName}</SC.ChainName>
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
