import { ElementRef, FC, useEffect, useRef, useState } from 'react'
import { Col, Row, Spin } from 'antd'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Chain } from 'wagmi'
import { useTranslation } from 'next-export-i18n'
import { useSelector } from 'react-redux'
import { debounce, round } from 'lodash'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { LoadingOutlined } from '@ant-design/icons'
import { RootState } from '@/redux/rootReducer'

// atoms
import InputField from '@/atoms/form/input/InputField'
import RadioButtons from '@/atoms/form/radioField/RadioField'
import Button from '@/atoms/button/Button'

// components
import MatchRow from './components/matchRow/MatchRow'
import SummaryCol from './components/summaryCol/SummaryCol'

// utils
import {
	CRYPTO_CURRENCY,
	FORM_ERROR_TYPE,
	MAX_BUY_IN,
	MAX_SELECTED_ALLOWANCE,
	MAX_TICKET_MATCHES,
	MAX_TOTAL_QUOTE,
	MIN_BUY_IN_PARLAY,
	MIN_BUY_IN_SINGLE,
	STABLE_COIN
} from '@/utils/constants'
import { FORM } from '@/utils/enums'
import handleOnchangeForm from './helpers/changeBetContainer'

// types
import { IUnsubmittedBetTicket, TicketPosition } from '@/redux/betTickets/betTicketTypes'

// styles
import * as SC from './TicketBetContainerStyles'
import * as SCS from '@/styles/GlobalStyles'

// icons
import SUSDIcon from '@/assets/icons/susd-icon.svg'
import DAIIcon from '@/assets/icons/dai-icon.svg'
import USDCIcon from '@/assets/icons/usdc-icon.svg'
import USDTIcon from '@/assets/icons/usdt-icon.svg'
import EmptyStateImage from '@/assets/icons/empty_state_ticket.svg'

interface IComponentProps {
	handleDeleteItem: (position: TicketPosition) => void
	handleApprove: any
	isWalletConnected: false | '' | (Chain & { unsupported?: boolean | undefined }) | undefined
	fetchTicketData: () => void
	getAllowance: () => Promise<number>
	available: number
	rolledUp: boolean
}

const TicketBetContainerForm: FC<IComponentProps & InjectedFormProps<{}, IComponentProps>> = ({
	handleSubmit,
	handleDeleteItem,
	handleApprove,
	isWalletConnected,
	available,
	rolledUp
}) => {
	const { t } = useTranslation()
	const isProcessing = useSelector((state: RootState) => state.betTickets.isProcessing)
	const formValues = useSelector((state) => getFormValues(FORM.BET_TICKET)(state as IUnsubmittedBetTicket)) as IUnsubmittedBetTicket
	const [error, setError] = useState<{ error: JSX.Element | null; type: FORM_ERROR_TYPE | null }>({
		error: null,
		type: null
	})
	const matches = formValues?.matches ?? []
	const hasAtLeastOneMatch = matches.length > 0
	const { openConnectModal } = useConnectModal()
	const listRef = useRef<ElementRef<'div'>>(null)
	const [fadeTop, setFadeTop] = useState(false)
	const [fadeBottom, setFadeBottom] = useState(true)
	const allowance = Number(round(Number(formValues?.allowance), 2).toFixed(2))
	const buyIn = Number(round(Number(formValues?.buyIn), 2).toFixed(2))
	const availableBalance = Number(round(Number(available), 2).toFixed(2))
	// minBuyIn for parlay is 3, for single is 1
	const minBuyIn = matches.length === 1 ? MIN_BUY_IN_SINGLE : MIN_BUY_IN_PARLAY

	const getActualStableCoinIcon = (actualStableCoin?: string) => {
		switch (actualStableCoin || formValues?.selectedStablecoin) {
			case STABLE_COIN.S_USD:
				return SUSDIcon
			case STABLE_COIN.DAI:
				return DAIIcon
			case STABLE_COIN.USDC:
				return USDCIcon
			case STABLE_COIN.USDT:
				return USDTIcon
			default:
				return 'unknown'
		}
	}
	const stableCoinsOptions = CRYPTO_CURRENCY.map((item) => ({
		label: (
			<SCS.FlexItemCenterWrapper>
				<SC.StableCoinIcon size={24} style={{ marginRight: 6 }} src={getActualStableCoinIcon(item)} />
				{item}
			</SCS.FlexItemCenterWrapper>
		),
		value: item,
		disabled: item === STABLE_COIN.DAI || item === STABLE_COIN.USDC || item === STABLE_COIN.USDT
	}))
	const getErrorContent = async () => {
		if (!isWalletConnected) {
			setError({
				error: <>{t('Please connect your wallet')}</>,
				type: FORM_ERROR_TYPE.ERROR
			})
			return
		}
		if (buyIn < minBuyIn) {
			setError({
				error: (
					<>
						{t('Minimum buy-in is')}{' '}
						<SC.Highlight>
							{minBuyIn.toFixed(2)} {formValues?.selectedStablecoin}
						</SC.Highlight>
					</>
				),
				type: FORM_ERROR_TYPE.ERROR
			})
			return
		}
		if (buyIn > MAX_BUY_IN) {
			setError({
				error: (
					<>
						{t('Maximum buy-in is')}{' '}
						<SC.Highlight>
							{MAX_BUY_IN.toFixed(2)} {formValues?.selectedStablecoin}
						</SC.Highlight>
					</>
				),
				type: FORM_ERROR_TYPE.ERROR
			})

			return
		}
		if (!allowance) {
			setError({
				error: (
					<>
						{t('You need to approve allowance for')} <SC.Highlight>{formValues?.selectedStablecoin}</SC.Highlight> {t('to continue')}
					</>
				),
				type: FORM_ERROR_TYPE.ERROR
			})

			return
		}
		if (allowance < buyIn) {
			setError({
				error: (
					<>
						{t('You dont have enough allowance for')} <SC.Highlight>{formValues?.selectedStablecoin}</SC.Highlight> {t('to continue')}
					</>
				),
				type: FORM_ERROR_TYPE.ERROR
			})

			return
		}

		if (availableBalance < buyIn) {
			setError({
				error: (
					<>
						{t('Available balance is')}{' '}
						<SC.Highlight>
							{availableBalance} {formValues?.selectedStablecoin}
						</SC.Highlight>{' '}
						{t('but you are trying to bet')}{' '}
						<SC.Highlight>
							{buyIn} {formValues?.selectedStablecoin}
						</SC.Highlight>
					</>
				),
				type: FORM_ERROR_TYPE.ERROR
			})

			return
		}
		if (Number(formValues?.maxBuyIn) < buyIn) {
			setError({
				error: (
					<>
						{t('Maximum buy-in supported is')} <SC.Highlight>{formValues?.maxBuyIn}</SC.Highlight>
					</>
				),
				type: FORM_ERROR_TYPE.ERROR
			})
			return
		}
		if (matches.length > MAX_TICKET_MATCHES) {
			setError({
				error: (
					<>
						{t('Maximum')} <SC.Highlight>{MAX_TICKET_MATCHES}</SC.Highlight> {t(' matches per ticket')}
					</>
				),
				type: FORM_ERROR_TYPE.ERROR
			})
		}
		// Warning on the end
		if (Number(formValues?.totalQuote) === MAX_TOTAL_QUOTE) {
			setError({
				error: (
					<>
						{t('Maximum total qoute supporded is')} <SC.Highlight>{formValues?.totalQuote}</SC.Highlight>
					</>
				),
				type: FORM_ERROR_TYPE.WARNING
			})
			return
		}
		setError({
			error: null,
			type: null
		})
	}

	useEffect(
		() => {
			getErrorContent()
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			matches.length,
			formValues?.maxBuyIn,
			formValues?.buyIn,
			isWalletConnected,
			formValues?.selectedStablecoin,
			formValues?.available,
			formValues?.allowance,
			formValues?.totalQuote
		]
	)

	const emptyTicketState = (
		<Row justify={'center'}>
			<Col span={24}>
				<SCS.Empty
					image={EmptyStateImage}
					imageStyle={{ height: 93 }}
					description={
						<div>
							<p>{t('Your ticket is empty')}</p>
							<span>{t('You dont have any matches in your ticket')}</span>
						</div>
					}
				/>
			</Col>
		</Row>
	)

	useEffect(() => {
		// TODO: event interface
		const onScroll = (event: any) => {
			const { target } = event
			const visibleScrollbar = target.scrollHeight > target.clientHeight
			if (target.scrollTop === 0 || !visibleScrollbar) {
				setFadeTop(false)
			} else if (target.scrollTop > 0 && visibleScrollbar) {
				setFadeTop(true)
			}

			if (target.clientHeight + target.scrollTop === target.scrollHeight || !visibleScrollbar) {
				setFadeBottom(false)
			} else if (target.clientHeight + target.scrollTop < target.scrollHeight && visibleScrollbar) {
				setFadeBottom(true)
			}
		}

		if (listRef.current !== null) {
			listRef.current.addEventListener('scroll', onScroll)
			// eslint-disable-next-line react-hooks/exhaustive-deps
			return () => listRef.current?.removeEventListener('scroll', onScroll)
		}
		return () => {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listRef.current])

	useEffect(() => {
		const visibleScrollbar = listRef.current !== null && listRef.current.scrollHeight > listRef.current.clientHeight
		if (!visibleScrollbar) {
			setFadeBottom(false)
			setFadeTop(false)
		}
		if (visibleScrollbar) {
			setFadeBottom(true)
		}
	}, [formValues?.matches?.length])

	return (
		<SC.FormWrapper $rolledUp={rolledUp} onSubmit={handleSubmit}>
			{hasAtLeastOneMatch ? (
				<SC.TicketMatchesFaded>
					<SC.TicketMatchesWrapper ref={listRef}>
						{formValues?.matches?.map((match, key) => (
							<MatchRow key={`matchRow-${key}-${match.gameId}`} match={match} deleteHandler={handleDeleteItem} />
						))}
					</SC.TicketMatchesWrapper>
					<SC.Fade show={fadeTop} direction={'above'} />
					<SC.Fade show={fadeBottom} direction={'under'} />
				</SC.TicketMatchesFaded>
			) : (
				emptyTicketState
			)}
			<Row style={{ marginTop: 12 }} justify={'space-between'} gutter={[0, 12]}>
				<Col>
					<SC.BuyInTitle>{t('Buy-in')}</SC.BuyInTitle>
				</Col>
				<Col span={24} style={{ overflow: 'overlay' }}>
					<Field name={'selectedStablecoin'} options={stableCoinsOptions} component={RadioButtons} />
				</Col>
				<Col span={24}>
					<Row>
						<SummaryCol
							title={t('Available')}
							value={
								<SCS.FlexItemCenterWrapper>
									{availableBalance} <SC.StableCoinIcon style={{ marginLeft: 4 }} src={getActualStableCoinIcon()} />
								</SCS.FlexItemCenterWrapper>
							}
							align={'left'}
						/>
						{allowance < MAX_SELECTED_ALLOWANCE && (
							<SummaryCol
								title={t('Allowance')}
								value={
									<SCS.FlexItemCenterWrapper>
										{allowance || 0} <SC.StableCoinIcon style={{ marginLeft: 4 }} src={getActualStableCoinIcon()} />
									</SCS.FlexItemCenterWrapper>
								}
								align={'right'}
							/>
						)}
					</Row>
				</Col>
				{hasAtLeastOneMatch && (
					<>
						<Col span={24}>
							<Field
								// TODO: refactor to NumberInputField instead of InputField (disable negative numbers, added format logic from notino project)
								component={InputField}
								type={'number'}
								name={'buyIn'}
								required
								max={MAX_BUY_IN}
								min={minBuyIn}
								placeholder={
									formValues?.minBuyIn
										? t('Enter Amount - Min. {{amount}} {{currency}}', {
												amount: formValues?.minBuyIn,
												currency: formValues?.selectedStablecoin
										  })
										: t('Enter Amount')
								}
							/>
						</Col>
						<Col span={24}>
							<Spin spinning={isProcessing} size='small' indicator={<LoadingOutlined spin />}>
								<Row gutter={[0, 12]} justify={'space-between'}>
									<SummaryCol title={t('Quote')} value={formValues?.totalQuote || 0} />
									<SummaryCol align={'right'} title={t('Bonus')} value={formValues?.totalBonus ? `${formValues?.totalBonus}%` : '0.00%'} />
									<SummaryCol
										title={t('Payout')}
										value={
											<SCS.FlexItemCenterWrapper>
												{formValues.payout} <SC.StableCoinIcon style={{ marginLeft: 4 }} src={getActualStableCoinIcon()} />
											</SCS.FlexItemCenterWrapper>
										}
									/>
									<SummaryCol
										isProfit
										title={t('Profit')}
										value={
											<SCS.FlexItemCenterWrapper>
												{formValues.potentionalProfit} <SC.StableCoinIcon style={{ marginLeft: 4 }} src={getActualStableCoinIcon()} />
											</SCS.FlexItemCenterWrapper>
										}
										align={'right'}
									/>
								</Row>
							</Spin>
						</Col>
						{error && (
							<SC.InfoBox type={error.type}>
								<SC.InfoBoxIcon type={error.type} />
								<SC.InfoBoxContent type={error.type}>{error.error}</SC.InfoBoxContent>
							</SC.InfoBox>
						)}
						{!isWalletConnected ? (
							<Button size={'large'} className={'make-bet-button'} onClick={openConnectModal} content={<span>{t('Connect wallet')}</span>} />
						) : (
							<Button
								size={'large'}
								className={`make-bet-button ${isProcessing && 'isProcessing'}`}
								disabled={allowance >= buyIn ? !!error && error.type === FORM_ERROR_TYPE.ERROR : false}
								onClick={allowance >= buyIn ? handleSubmit : handleApprove}
								content={allowance >= buyIn ? <span>{t('Submit')}</span> : <span>{t('Approve allowance')}</span>}
							/>
						)}

						<SC.Fee>{`${t('Parlay fee')}: ${formValues?.fees?.parlay}%`}</SC.Fee>
						<SC.Fee>{`${t('Safebox fee')}: ${formValues?.fees?.safebox}%`}</SC.Fee>
						<SC.Fee>{`${t('SKEW')}: ${formValues?.fees?.skew}%`}</SC.Fee>
					</>
				)}
			</Row>
		</SC.FormWrapper>
	)
}

const form = reduxForm<IUnsubmittedBetTicket, IComponentProps>({
	form: FORM.BET_TICKET,
	forceUnregisterOnUnmount: true,
	destroyOnUnmount: false,
	touchOnChange: true,
	onChange: debounce(handleOnchangeForm, 300)
})(TicketBetContainerForm)

export default form
