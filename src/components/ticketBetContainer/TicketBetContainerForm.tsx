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
import { IconWrapper } from '@/components/matchesList/MatchesListStyles'
import MatchRow from './components/matchRow/MatchRow'
import SummaryCol from './components/summaryCol/SummaryCol'

// utils
import { MAX_BUY_IN, MAX_SELECTED_ALLOWANCE, MAX_TICKET_MATCHES, MAX_TOTAL_QUOTE, MIN_BUY_IN, STABLE_COIN } from '@/utils/constants'
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
	const [error, setError] = useState<JSX.Element | null>()
	const matches = formValues?.matches ?? []
	const hasAtLeastOneMatch = matches.length > 0
	const { openConnectModal } = useConnectModal()
	const listRef = useRef<ElementRef<'div'>>(null)
	const [fadeTop, setFadeTop] = useState(false)
	const [fadeBottom, setFadeBottom] = useState(true)
	const allowance = Number(round(Number(formValues?.allowance), 2).toFixed(2))
	const buyIn = Number(round(Number(formValues?.buyIn), 2).toFixed(2))
	const availableBalance = Number(round(Number(available), 2).toFixed(2))

	const payWithOptions = [
		{
			label: (
				<IconWrapper>
					<SCS.Icon icon={SUSDIcon} style={{ margin: '-6px' }} />
					{STABLE_COIN.S_USD}
				</IconWrapper>
			),
			value: STABLE_COIN.S_USD
		},
		{
			label: (
				<IconWrapper>
					<SCS.Icon icon={DAIIcon} style={{ margin: '-6px' }} />
					{STABLE_COIN.DAI}
				</IconWrapper>
			),
			disabled: true,
			value: STABLE_COIN.DAI
		},
		{
			label: (
				<IconWrapper>
					<SCS.Icon icon={USDCIcon} style={{ margin: '-6px' }} />
					{STABLE_COIN.USDC}
				</IconWrapper>
			),
			disabled: true,
			value: STABLE_COIN.USDC
		},
		{
			label: (
				<IconWrapper>
					<SCS.Icon icon={USDTIcon} style={{ margin: '-6px' }} />
					{STABLE_COIN.USDT}
				</IconWrapper>
			),
			disabled: true,
			value: STABLE_COIN.USDT
		}
	]
	const getErrorContent = async () => {
		if (!isWalletConnected) {
			setError(() => <>{t('Please connect your wallet')}</>)
			return
		}
		if (buyIn < MIN_BUY_IN) {
			setError(() => (
				<>
					{t('Minimum buy-in is')}{' '}
					<SC.Highlight>
						{MIN_BUY_IN.toFixed(2)} {formValues?.selectedStablecoin}
					</SC.Highlight>
				</>
			))
			return
		}
		if (buyIn > MAX_BUY_IN) {
			setError(() => (
				<>
					{t('Maximum buy-in is')}{' '}
					<SC.Highlight>
						{MAX_BUY_IN.toFixed(2)} {formValues?.selectedStablecoin}
					</SC.Highlight>
				</>
			))
			return
		}
		if (!allowance) {
			setError(() => (
				<>
					{t('You need to approve allowance for')} <SC.Highlight>{formValues?.selectedStablecoin}</SC.Highlight> {t('to continue')}
				</>
			))
			return
		}
		if (allowance < buyIn) {
			setError(() => (
				<>
					{t('You dont have enough allowance for')} <SC.Highlight>{formValues?.selectedStablecoin}</SC.Highlight> {t('to continue')}
				</>
			))
			return
		}

		if (availableBalance < buyIn) {
			setError(() => (
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
			))
			return
		}
		if (Number(formValues?.maxBuyIn) < buyIn) {
			setError(() => (
				<>
					{t('Maximum buy-in supported is')} <SC.Highlight>{formValues?.maxBuyIn}</SC.Highlight>
				</>
			))
			return
		}
		if (matches.length > MAX_TICKET_MATCHES) {
			setError(() => (
				<>
					{t('Maximum')} <SC.Highlight>{MAX_TICKET_MATCHES}</SC.Highlight> {t(' matches per ticket')}
				</>
			))
		}
		setError(null)
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
			formValues?.allowance
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
			return () => listRef.current?.removeEventListener('scroll', onScroll)
		}
		return () => {}
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
		<SC.FormWrapper onSubmit={handleSubmit} style={{ display: rolledUp ? 'block' : 'none' }}>
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
					<Field name={'selectedStablecoin'} options={payWithOptions} component={RadioButtons} />
				</Col>
				<Col span={24}>
					<Row>
						<SummaryCol title={t('Available')} value={`${availableBalance || 0} ${formValues?.selectedStablecoin}`} align={'left'} />
						{allowance < MAX_SELECTED_ALLOWANCE && (
							<SummaryCol title={t('Allowance')} value={`${allowance || 0} ${formValues?.selectedStablecoin}`} align={'right'} />
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
								min={MIN_BUY_IN}
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
						<Spin spinning={isProcessing} size='small' indicator={<LoadingOutlined spin />}>
							<Row gutter={[0, 12]}>
								<SummaryCol
									title={t('Total Quote')}
									value={`${formValues?.totalQuote || 0} ${Number(formValues?.totalQuote) === MAX_TOTAL_QUOTE ? '(MAX)' : ''}`}
								/>
								<SummaryCol title={t('Total Bonus')} value={formValues?.totalBonus ? `${formValues?.totalBonus}%` : '0.00%'} align={'right'} />
								<SummaryCol title={t('Payout')} value={`${formValues.payout} ${formValues?.selectedStablecoin}`} />
								<SummaryCol
									isProfit
									title={t('Profit')}
									value={`+ ${formValues.potentionalProfit} ${formValues?.selectedStablecoin}`}
									align={'right'}
								/>
							</Row>
						</Spin>
						{error && (
							<SC.InfoBox>
								<SC.InfoBoxIcon />
								<SC.InfoBoxContent>{error}</SC.InfoBoxContent>
							</SC.InfoBox>
						)}
						{!isWalletConnected ? (
							<Button
								type={'primary'}
								size={'large'}
								className={'make-bet-button'}
								onClick={openConnectModal}
								content={<span>{t('Connect wallet')}</span>}
							/>
						) : (
							<Button
								type={'primary'}
								size={'large'}
								className={`make-bet-button ${isProcessing && 'isProcessing'}`}
								disabled={allowance >= buyIn ? !!error : false}
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
})(TicketBetContainerForm as any)

export default form
