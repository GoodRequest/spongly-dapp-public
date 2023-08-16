import React from 'react'
import * as SC from './ButtonStyles'

interface IButton {
	type?: 'primary' | 'link' | 'text' | 'default' | 'ghost' | 'dashed' | undefined
	btnStyle?: 'primary' | 'secondary' | 'tertiary'
	onClick?: React.MouseEventHandler
	content: JSX.Element | string
	id?: string
	disabled?: boolean
	className?: string
	style?: any
	htmlType?: string
	isLoading?: boolean
	size?: 'small' | 'large' | 'middle'
	disabledPopoverText?: string
}

const Button: React.FC<IButton> = ({
	type = 'primary',
	btnStyle = 'primary',
	htmlType = 'button',
	onClick,
	content,
	className,
	disabled = false,
	style = {},
	size,
	isLoading,
	disabledPopoverText
}) => {
	const buttonStyle = () => {
		switch (btnStyle) {
			case 'primary':
				return disabled && disabledPopoverText ? (
					<SC.Popover title={disabledPopoverText}>
						<SC.PrimaryButton
							htmlType={htmlType as any}
							type={type}
							loading={isLoading}
							onClick={onClick}
							disabled={disabled}
							style={style}
							size={size}
							className={className}
						>
							{content}
						</SC.PrimaryButton>
					</SC.Popover>
				) : (
					<SC.PrimaryButton
						htmlType={htmlType as any}
						type={type}
						loading={isLoading}
						onClick={onClick}
						disabled={disabled}
						style={style}
						size={size}
						className={className}
					>
						{content}
					</SC.PrimaryButton>
				)
			case 'secondary':
				return disabled && disabledPopoverText ? (
					<SC.Popover title={disabledPopoverText}>
						<SC.SecondaryButton
							htmlType={htmlType as any}
							type={type}
							loading={isLoading}
							onClick={onClick}
							disabled={disabled}
							size={size}
							style={style}
							className={className}
						>
							{content}
						</SC.SecondaryButton>
					</SC.Popover>
				) : (
					<SC.SecondaryButton
						htmlType={htmlType as any}
						type={type}
						loading={isLoading}
						onClick={onClick}
						disabled={disabled}
						size={size}
						style={style}
						className={className}
					>
						{content}
					</SC.SecondaryButton>
				)
			case 'tertiary':
				return disabled && disabledPopoverText ? (
					<SC.Popover title={disabledPopoverText}>
						<SC.TertiaryButton htmlType={htmlType as any} type={type} loading={isLoading} onClick={onClick} disabled={disabled} style={style}>
							{content}
						</SC.TertiaryButton>
					</SC.Popover>
				) : (
					<SC.TertiaryButton htmlType={htmlType as any} type={type} loading={isLoading} onClick={onClick} disabled={disabled} style={style}>
						{content}
					</SC.TertiaryButton>
				)
			default:
				return (
					<SC.PrimaryButton
						htmlType={htmlType as any}
						type={type}
						loading={isLoading}
						onClick={onClick}
						disabled={disabled}
						size={size}
						style={style}
						className={className}
					>
						{content}
					</SC.PrimaryButton>
				)
		}
	}

	return buttonStyle()
}

export default Button
