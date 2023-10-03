import { Pagination, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRouter } from 'next-translate-routes'
import { useCallback, useEffect, useState } from 'react'
import * as SC from './PresentationSliderStyles'
import { presentationSliderData } from '@/utils/mocap'
import Button from '@/atoms/button/Button'
import { useMedia } from '@/hooks/useMedia'
import { RESOLUTIONS } from '@/utils/enums'
import { isBellowOrEqualResolution } from '@/utils/helpers'

const PresentationSlider = () => {
	const router = useRouter()
	const size = useMedia()
	const [isMounted, setIsMounted] = useState(false)

	const handleClickButton = (url: string, isPageRedirect: boolean) => {
		if (isPageRedirect) {
			router.push(url)
		} else {
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('target', '_blank')
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}

	useEffect(() => {
		// NOTE: Slides have to be mounted after the first render to avoid a bug with the swiper default image for desktop
		setIsMounted(true)
	}, [])

	const getSwiperCards = useCallback(
		() =>
			presentationSliderData.map(({ text, textColor, image, mobileImage, button = undefined }, index) => (
				<SwiperSlide key={`slider-${index}`}>
					<SC.SlideCard image={size === RESOLUTIONS.SX || size === RESOLUTIONS.SMSX ? mobileImage : image}>
						<SC.SliderText textColor={textColor}>{text}</SC.SliderText>
						{button && (
							<SC.SliderButton>
								<Button
									btnStyle={'primary'}
									size={isBellowOrEqualResolution(size, RESOLUTIONS.MD) ? 'small' : undefined}
									content={<span>{button?.title}</span>}
									onClick={() => handleClickButton(button.redirectUrl, button.isPageRedirect)}
								/>
							</SC.SliderButton>
						)}
					</SC.SlideCard>
				</SwiperSlide>
			)),
		[size]
	)

	return (
		<SC.PresentationSliderWrapper>
			<Swiper
				followFinger={true}
				loop={true}
				slidesPerView={1}
				modules={[Autoplay, Pagination]}
				pagination={{
					clickable: true
				}}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false
				}}
			>
				{isMounted && getSwiperCards()}
			</Swiper>
		</SC.PresentationSliderWrapper>
	)
}

export default PresentationSlider
