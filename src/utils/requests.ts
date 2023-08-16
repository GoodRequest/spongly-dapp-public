/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/default-param-last */
import axios, { AxiosError, AxiosRequestConfig, CancelTokenSource } from 'axios'
import { message as antMessage, notification } from 'antd'
import { forEach, get, has, isEmpty, lowerCase } from 'lodash'
import qs from 'qs'
import { MSG_TYPE } from './constants'
import { IErrorMessage } from '@/typescript/types'
import { translateMessageType } from './helpers'

export const showNotifications = (messages: IErrorMessage[], t: any, showNotification?: boolean) => {
	if (!isEmpty(messages) && showNotification) {
		forEach(messages, (message) => {
			let notif
			switch (lowerCase(message.type)) {
				case 'info':
					notif = notification.info
					break
				case 'warning':
					notif = notification.warning
					break
				case 'success':
					notif = notification.success
					break
				case 'error':
					notif = notification.error
					break
				default:
					notif = notification.info
					break
			}
			notif({
				message: translateMessageType(message.type, t)
			})
		})
	}
}

export const showErrorNotifications = (error: AxiosError | Error | unknown, t: any, showNotification?: boolean) => {
	let messages = get(error, 'response.data.messages')

	if (get(error, 'response.status') === 504 || get(error, 'response') === undefined || get(error, 'message') === 'Network Error') {
		messages = [
			{
				type: MSG_TYPE.ERROR,
				message: t('Error connecting to server')
			}
		]
		showNotifications(messages, t, showNotification)
	} else {
		// if BE do not send message set general error message
		messages = isEmpty(messages) ? [{ type: MSG_TYPE.ERROR, message: t('Ooops something went wrong') }] : messages
		showNotifications(messages, t, showNotification)
	}
}

interface ICustomConfig extends AxiosRequestConfig {
	messages?: IErrorMessage[]
}

const buildHeaders = () => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'Access-Control-Allow-Credentials': 'true',
		'Cache-Control': 'no-cache, no-store',
		Pragma: 'no-cache'
		// 'X-Version': process.env.REACT_APP_VERSION as string,
		// 'accept-language': 'sk'
	}

	return headers
}

/**
 * @param url url endpoint
 * @param params Object object
 * @param customConfig overwrite defaultConfig with custom one
 * @param showNotification boolean show notificaion
 * @return Promise response
 *
 */
const cancelGetTokens = {} as { [key: string]: CancelTokenSource }
export const getReq = async (
	t: any,
	url: string,
	params?: any,
	customConfig: ICustomConfig = {},
	showNotification?: boolean,
	showLoading = false,
	allowCancelToken = false
) => {
	let token = {}
	if (allowCancelToken) {
		if (typeof cancelGetTokens[url] !== typeof undefined) {
			cancelGetTokens[url].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelGetTokens[url] = axios.CancelToken.source()
		token = {
			cancelToken: cancelGetTokens[url].token
		}
	}
	let hide
	if (showLoading) {
		hide = antMessage.loading('Loading data...', 0)
	}
	const config: AxiosRequestConfig = {
		paramsSerializer: {
			serialize: (serializeParams: Record<string, any>) => qs.stringify(serializeParams), // mimic pre 1.x behavior and send entire params object to a custom serializer func. Allows consumer to control how params are serialized.
			indexes: false // array indexes format (null - no brackets, false (default) - empty brackets, true - brackets with indexes)
		},
		...customConfig,
		...token,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		}
	}

	if (params) {
		config.params = params
	}

	try {
		const res = await axios.get(url, config)
		if (showNotification) {
			if (customConfig && customConfig.messages) {
				showNotifications(customConfig.messages, t, showNotification)
			} else if (has(res, 'data.messages')) {
				showNotifications(get(res, 'data.messages'), t, showNotification)
			}
		}
		if (hide) {
			hide()
		}

		return res
	} catch (e) {
		if (!axios.isCancel(e) && showNotification) {
			showErrorNotifications(e, t, showNotification)
		}
		if (hide) {
			hide()
		}
		return Promise.reject(e)
	}
}

/**
 * @param url url endpoint
 * @param params Object params object
 * @param data Object data object
 * @param customConfig overwrite defaultConfig with custom one
 * @param showNotification boolean show notificaion
 * @param showLoading Boolean show loading
 * @return Promise response
 * Performs post request to url and returns callback with result
 */
const cancelPostTokens = {} as { [key: string]: CancelTokenSource }
export const postReq = async (
	t: any,
	url: string,
	params: any,
	data: any = {},
	customConfig: ICustomConfig = {},
	showNotification?: boolean,
	showLoading = false,
	allowCancelToken = false
) => {
	let token = {}
	if (allowCancelToken) {
		if (typeof cancelPostTokens[url] !== typeof undefined) {
			cancelPostTokens[url].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelPostTokens[url] = axios.CancelToken.source()
		token = {
			cancelToken: cancelPostTokens[url].token
		}
	}

	let hide
	if (showLoading) {
		hide = antMessage.loading('Operation in progress...', 0)
	}
	const config = {
		...customConfig,
		...token,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		}
	}

	if (params) {
		config.params = params
	}

	try {
		const res = await axios.post(url, data, config)
		if (showNotification) {
			if (customConfig && customConfig.messages) {
				showNotifications(customConfig.messages, t, showNotification)
			} else if (has(res, 'data.messages')) {
				showNotifications(get(res, 'data.messages'), t, showNotification)
			}
		}

		if (hide) {
			hide()
		}
		return res
	} catch (e) {
		if (!axios.isCancel(e) && showNotification) {
			showErrorNotifications(e, t, showNotification)
		}
		if (hide) {
			hide()
		}
		return Promise.reject(e)
	}
}

/**
 * @param url url endpoint
 * @param params Object params object
 * @param data Object data object
 * @param customConfig overwrite defaultConfig with custom one
 * @param showNotification boolean show notificaion
 *
 * Performs put request to url and returns callback with result
 */
const cancelPatchTokens = {} as { [key: string]: CancelTokenSource }
export const patchReq = async (
	t: any,
	url: string,
	params: any,
	data: any = {},
	customConfig: ICustomConfig = {},
	showNotification?: boolean,
	showLoading = false,
	allowCancelToken = false
) => {
	let token = {}
	if (allowCancelToken) {
		if (typeof cancelPatchTokens[url] !== typeof undefined) {
			cancelPatchTokens[url].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelPatchTokens[url] = axios.CancelToken.source()
		token = {
			cancelToken: cancelPatchTokens[url].token
		}
	}

	let hide
	if (showLoading) {
		hide = antMessage.loading('Operation in progress...', 0)
	}
	const config = {
		...customConfig,
		...token,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		}
	}

	if (params) {
		config.params = params
	}
	try {
		const res = await axios.patch(url, data, config)
		if (showNotification && customConfig && customConfig.messages) {
			showNotifications(customConfig.messages, t, showNotification)
		} else if (showNotification && has(res, 'data.messages')) {
			showNotifications(get(res, 'data.messages'), t, showNotification)
		}
		if (hide) {
			hide()
		}
		return res
	} catch (e) {
		if (!axios.isCancel(e) && showNotification) {
			showErrorNotifications(e, t, showNotification)
		}
		if (hide) {
			hide()
		}
		return Promise.reject(e)
	}
}

/**
 * @param url url endpoint
 * @param params Object params object
 * @param customConfig overwrite defaultConfig with custom one
 * @param showNotification boolean show notificaion
 * @param showLoading Boolean show loading
 *
 * Performs delete request to url and returns with result
 */
export const deleteReq = async (t: any, url: string, params: any, customConfig: ICustomConfig = {}, showNotification?: boolean, showLoading = false) => {
	let hide
	if (showLoading) {
		hide = antMessage.loading('Operation in progress...', 0)
	}

	const config = {
		...customConfig,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		}
	}

	if (params) {
		config.params = params
	}

	try {
		const res = await axios.delete(url, config)

		if (showNotification && customConfig && customConfig.messages) {
			showNotifications(customConfig.messages, t, showNotification)
		} else if (showNotification && has(res, 'data.messages')) {
			showNotifications(get(res, 'data.messages'), t, showNotification)
		}

		if (hide) {
			hide()
		}

		return res
	} catch (e) {
		if (hide) {
			hide()
		}

		if (!axios.isCancel(e) && showNotification) {
			showErrorNotifications(e, t, showNotification)
		}
		return Promise.reject(e)
	}
}
