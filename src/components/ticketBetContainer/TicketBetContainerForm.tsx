import { FC, useEffect, useState } from 'react'
import { Col, Row, Spin } from 'antd'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Chain } from 'wagmi'
import { useTranslation } from 'next-export-i18n'
import { useSelector } from 'react-redux'
import { debounce, round, toNumber } from 'lodash'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { LoadingOutlined } from '@ant-design/icons'

// atoms
import InputField from '@/atoms/form/input/InputField'
import RadioButtons from '@/atoms/form/radioField/RadioField'
import Button from '@/atoms/button/Button'

// components
import { IconWrapper } from '@/components/matchesList/MatchesListStyles'
import MatchRow from './components/matchRow/MatchRow'
import SummaryCol from './components/summaryCol/SummaryCol'

// utils
import { roundNumberToDecimals } from '@/utils/formatters/number'
import { MAX_BUY_IN, MAX_TICKET_MATCHES, MAX_TOTAL_QUOTE, MIN_BUY_IN, STABLE_COIN } from '@/utils/constants'
import { FORM } from '@/utils/enums'

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
import { RootState } from '@/redux/rootReducer'
import handleOnchangeForm from './helpers/changeBetContainer'

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
			setError(() => <span>{t('Please connect your wallet')}</span>)
			return
		}
		if (buyIn < MIN_BUY_IN) {
			setError(() => (
				<span>
					{t('Minimum buy-in is')}{' '}
					<SC.Highlight>
						{MIN_BUY_IN.toFixed(2)} {formValues?.selectedStablecoin}
					</SC.Highlight>
				</span>
			))
			return
		}
		if (!allowance) {
			setError(() => (
				<span>
					{t('You need to approve allowance for')} <SC.Highlight>{formValues?.selectedStablecoin}</SC.Highlight> {t('to continue')}
				</span>
			))
			return
		}
		if (allowance < buyIn) {
			setError(() => (
				<span>
					{t('You dont have enough allowance for')} <SC.Highlight>{formValues?.selectedStablecoin}</SC.Highlight> {t('to continue')}
				</span>
			))
			return
		}

		if (availableBalance < buyIn) {
			setError(() => (
				<span>
					{t('Available balance is')}{' '}
					<SC.Highlight>
						{availableBalance} {formValues?.selectedStablecoin}
					</SC.Highlight>{' '}
					{t('but you are trying to bet')}{' '}
					<SC.Highlight>
						{buyIn} {formValues?.selectedStablecoin}
					</SC.Highlight>
				</span>
			))
			return
		}

		if (toNumber(formValues?.totalQuote) > MAX_TOTAL_QUOTE) {
			setError(() => (
				<span>
					{t('Maximum total quote supported is')} <SC.Highlight>{MAX_TOTAL_QUOTE.toFixed(2)}</SC.Highlight>
				</span>
			))
			return
		}
		if (Number(formValues?.maxBuyIn) < buyIn) {
			setError(() => (
				<span>
					{t('Maximum buy-in supported is')} <SC.Highlight>{formValues?.maxBuyIn}</SC.Highlight>
				</span>
			))
			return
		}
		if (matches.length > MAX_TICKET_MATCHES) {
			setError(() => (
				<span>
					{t('Maximum')} <SC.Highlight>{MAX_TICKET_MATCHES}</SC.Highlight> {t(' matches per ticket')}
				</span>
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
				<SC.EmptyState
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

	return (
		<form onSubmit={handleSubmit} style={{ display: rolledUp ? 'block' : 'none' }}>
			{hasAtLeastOneMatch ? (
				<SC.TicketMatchesWrapper>
					{formValues?.matches?.map((match, key) => (
						<MatchRow key={`matchRow-${key}-${match.gameId}`} match={match} allTicketMatches={matches} deleteHandler={handleDeleteItem} />
					))}
				</SC.TicketMatchesWrapper>
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
						<Col span={12}>
							<SC.AvailableBalanceTitle>{t('Available')}: </SC.AvailableBalanceTitle>
							<SC.AvailableBalance value={availableBalance || 0}>
								{availableBalance || 0} {formValues?.selectedStablecoin}
							</SC.AvailableBalance>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<SC.AvailableBalanceTitle>{t('Allowance')}: </SC.AvailableBalanceTitle>
							<SC.AvailableBalance value={allowance || 0}>
								{allowance || 0} {formValues?.selectedStablecoin}
							</SC.AvailableBalance>
						</Col>
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
									value={formValues?.totalQuote && formValues?.totalQuote > 0 ? formValues?.totalQuote : '-'}
								/>
								<SummaryCol title={t('Total Bonus')} value={`${formValues?.totalBonus}%` ?? '-'} align={'right'} />
								<SummaryCol
									title={t('Payout')}
									value={formValues?.payout && formValues.payout !== 0 ? `${formValues.payout} ${formValues?.selectedStablecoin}` : '-'}
								/>
								<SummaryCol
									title={t('Profit')}
									value={
										formValues?.potentionalProfit && formValues.potentionalProfit !== 0
											? `${roundNumberToDecimals(formValues.potentionalProfit)} ${formValues?.selectedStablecoin}`
											: '-'
									}
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
		</form>
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
