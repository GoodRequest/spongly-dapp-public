import { FC } from 'react'
import { ModalProps } from 'antd'

// styles
import * as SC from './ModalStyles'
import CloseModalIcon from '@/assets/icons/asComponent/CloseModalIcon'

type Props = ModalProps

const Modal: FC<Props> = ({
	open,
	width = 514,
	className,
	centered = true,
	title,
	onCancel,
	closeIcon = <CloseModalIcon />,
	closable = true,
	footer = null,
	keyboard = true,
	maskClosable = false,
	style,
	children
}) => {
	return (
		<SC.NewModal
			open={open}
			width={width}
			className={`${className} custom-ant-modal-v5`}
			centered={centered}
			title={title && <h5>{title}</h5>}
			closeIcon={closeIcon}
			closable={closable}
			onCancel={onCancel}
			footer={footer}
			keyboard={keyboard}
			maskClosable={maskClosable}
			style={style}
			getContainer={() => document.getElementById('modal-container') || document.body}
		>
			{children}
		</SC.NewModal>
	)
}

export default Modal
