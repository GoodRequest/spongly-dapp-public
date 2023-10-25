import React, { FC, ReactNode, useState } from 'react'
import { Input, Space } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useTranslation } from 'next-export-i18n'
import * as SC from './frontendDevWallStyles'
import * as SCS from '../../layout/layout/LayoutStyles'
import LogoImg from '@/assets/icons/sponglyLogo.svg'
import Button from '@/atoms/button/Button'

interface ILayout {
	children: ReactNode
}

const FrontendDevWall: FC<ILayout> = ({ children }) => {
	const [showOverlay, setShowOverlay] = useState(process.env.PASSWORD_VALIDATION === 'true')
	const [password, setPassword] = useState('')
	const { t } = useTranslation()

	const validPassword = process.env.DEV_PASSWORD

	const handlePassword = (value: string) => {
		if (value === validPassword) {
			setShowOverlay(false)
		}
	}

	return (
		<>
			{showOverlay ? (
				<SC.LoaginOverlay show={showOverlay}>
					<SCS.Logo src={LogoImg} alt={'Spongly'} />
					<Space>
						<SC.StyledInput>
							<Input.Password
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={t('Input password')}
								iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
							/>
						</SC.StyledInput>
						<br />
						<Button btnStyle={'primary'} size={'middle'} content={<span>{t('Authorize')}</span>} onClick={() => handlePassword(password)} />
					</Space>
				</SC.LoaginOverlay>
			) : (
				children
			)}
			<span />
		</>
	)
}

export default FrontendDevWall
