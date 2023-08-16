import { useRouter } from 'next-translate-routes'

import * as SC from './HeaderLogoStyles'

import LogoImg from '@/assets/icons/sponglyLogo.svg'
import { PAGES } from '@/utils/enums'

const HeaderLogo = () => {
	const router = useRouter()

	return <SC.Logo alt={'logo'} src={LogoImg} onClick={() => router.push(`/${PAGES.DASHBOARD}`)} />
}

export default HeaderLogo
