import Head from 'next/head'
import { useTranslation } from 'next-export-i18n'

export interface IShareTags {
	url?: string
	title?: string
	keywords?: string
	description?: string
	image?: string
	imageAlt?: string
}

export interface ISEOHelmet {
	shareTags: IShareTags
}

const capitalizeFirstLetter = (string?: string) => {
	if (!string) {
		return ''
	}
	return string.charAt(0).toUpperCase() + string.slice(1)
}

const SEOHelmet = ({ shareTags }: ISEOHelmet) => {
	const { t } = useTranslation()
	const st = shareTags

	// TODO: defaultImage, wait for designs
	return (
		<Head>
			<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
			{/* Primary meta tags */}
			<title>{st?.title ? `${capitalizeFirstLetter(st?.title)} | Spongly` : 'Spongly'}</title>
			<meta name={'title'} content={st?.title ? `${capitalizeFirstLetter(st?.title)} | Spongly` : 'Spongly'} />
			<meta name={'description'} content={capitalizeFirstLetter(st?.description || (t('default-header-description') as string))} />
			<meta name={'keywords'} content={st?.keywords || (t('default-header-keywords') as string)} />
			<link rel='icon' type='image/png' sizes='32x32' href={'/favicons/favicon-32x32.png'} />
			<link rel='icon' type='image/png' sizes='16x16' href={'/favicons/favicon-16x16.png'} />
			{/* Open Graph / Facebook */}
			<meta property={'og:site_name'} content={'Spongly'} />
			<meta property={'og:title'} content={capitalizeFirstLetter(st?.title || 'Spongly')} />
			<meta property={'og:description'} content={capitalizeFirstLetter(st?.description)} />
			<meta property={'og:image'} content={st?.image || '/logos/ogimage.png'} />
			<meta property={'og:image:alt'} content={st?.imageAlt || 'Spongly'} />
			<meta property={'og:type'} content={'website'} />
		</Head>
	)
}

export default SEOHelmet
