/* eslint-disable import/no-cycle */
import React from 'react'
import { forEach, isEmpty, lowerCase } from 'lodash'
import { notification } from 'antd'

// types
import { IErrorMessage } from '@/typescript/types'

// utils
import { NOTIFICATION_TYPE, ORDER_DIRECTION } from '@/utils/constants'

// assets
import InfoIcon from '@/assets/icons/asComponent/InfoIcon'
import SuccessIcon from '@/assets/icons/asComponent/SuccessIcon'
import * as SC from '@/content/ParlayLeaderboardContent/ParlayLeaderboardContentStyles'
import ArrowDownIcon from '@/assets/icons/arrow-down-2.svg'
import { decodeSorter } from '@/utils/helpers'

// NOTE: helpere ktore potrebuju pracovat s JSX.Element cize potrebuju aby bol importnuty react a mali priponu jsx/tsx lebo TS nedovoli aby React component bol js/ts neda sa to ignorovat
// Tento wrapper bude len exportovat funkcie ktore pracuju s nejkaym JSX.Elemetnom (eg: <NotifCloseIcon />)

export const showNotifications = (messages: IErrorMessage[], typeNotification: NOTIFICATION_TYPE) => {
	if (!isEmpty(messages)) {
		if (typeNotification === NOTIFICATION_TYPE.NOTIFICATION) {
			forEach(messages, (message) => {
				let notif
				let icon
				switch (lowerCase(message.type)) {
					case 'warning':
						notif = notification.warning
						icon = <InfoIcon style={{ color: '#FF8833' }} />
						break
					case 'success':
						notif = notification.success
						icon = <SuccessIcon style={{ color: '#A8E58A' }} />
						break
					case 'error':
						notif = notification.error
						icon = <InfoIcon style={{ color: '#E11D48' }} />
						break
					case 'info':
					default:
						notif = notification.info
						icon = <InfoIcon style={{ color: '#6674FF' }} />
						break
				}
				notif({
					message: '',
					icon,
					closeIcon: null,
					description: message.message
				})
			})
		} else if (typeNotification === NOTIFICATION_TYPE.MODAL) {
			// TODO: doriesit modal notification
		}
	}
}

export const getSortIcon = (sorterName: any) => {
	const { direction, property } = decodeSorter()

	if (!direction || sorterName !== property) return undefined
	if (direction === ORDER_DIRECTION.ASCENDENT) {
		return <SC.ButtonIcon src={ArrowDownIcon} style={{ transform: 'rotate(180deg)' }} />
	}
	return <SC.ButtonIcon src={ArrowDownIcon} />
}
