import React from 'react'
import { ButtonProps as AntdButtonProps, Spin } from 'antd'
import * as SC from './ButtonStyles'

type ButtonProps = AntdButtonProps & {
	btnStyle?: 'primary' | 'secondary' | 'tertiary'
	content: JSX.Element | string
	disabledPopoverText?: string
}

const Button: React.FC<ButtonProps> = ({
	type = 'primary',
	btnStyle = 'primary',
	htmlType = 'button',
	onClick,
	content,
	className,
	disabled = false,
	style = {},
	size,
	loading,
	disabledPopoverText
}) => {
	const buttonStyle = () => {
		const contentWrapper = loading ? <Spin /> : content
		switch (btnStyle) {
			case 'primary':
				return disabled && disabledPopoverText ? (
					<SC.Popover title={disabledPopoverText}>
						<SC.PrimaryButton
							htmlType={htmlType as any}
							type={type}
							onClick={onClick}
							disabled={disabled || !!loading}
							style={style}
							size={size}
							className={className}
						>
							{contentWrapper}
						</SC.PrimaryButton>
					</SC.Popover>
				) : (
					<SC.PrimaryButton
						htmlType={htmlType as any}
						type={type}
						onClick={onClick}
						disabled={disabled || !!loading}
						style={style}
						size={size}
						className={className}
					>
						{contentWrapper}
					</SC.PrimaryButton>
				)
			case 'secondary':
				return disabled && disabledPopoverText ? (
					<SC.Popover title={disabledPopoverText}>
						<SC.SecondaryButton
							htmlType={htmlType as any}
							type={type}
							loading={loading}
							onClick={onClick}
							disabled={disabled || !!loading}
							size={size}
							style={style}
							className={className}
						>
							{contentWrapper}
						</SC.SecondaryButton>
					</SC.Popover>
				) : (
					<SC.SecondaryButton
						htmlType={htmlType as any}
						type={type}
						loading={loading}
						onClick={onClick}
						disabled={disabled || !!loading}
						size={size}
						style={style}
						className={className}
					>
						{contentWrapper}
					</SC.SecondaryButton>
				)
			case 'tertiary':
				return disabled && disabledPopoverText ? (
					<SC.Popover title={disabledPopoverText}>
						<SC.TertiaryButton
							htmlType={htmlType as any}
							type={type}
							loading={loading}
							onClick={onClick}
							disabled={disabled || !!loading}
							style={style}
						>
							{contentWrapper}
						</SC.TertiaryButton>
					</SC.Popover>
				) : (
					<SC.TertiaryButton
						htmlType={htmlType as any}
						type={type}
						loading={loading}
						onClick={onClick}
						disabled={disabled || !!loading}
						style={style}
					>
						{contentWrapper}
					</SC.TertiaryButton>
				)
			default:
				return (
					<SC.PrimaryButton
						htmlType={htmlType as any}
						type={type}
						loading={loading}
						onClick={onClick}
						disabled={disabled || !!loading}
						size={size}
						style={style}
						className={className}
					>
						{contentWrapper}
					</SC.PrimaryButton>
				)
		}
	}

	return buttonStyle()
}

export default Button
