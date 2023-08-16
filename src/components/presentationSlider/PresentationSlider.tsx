import { Pagination, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRouter } from 'next-translate-routes'
import * as SC from './PresentationSliderStyles'
import { presentationSliderData } from '@/utils/mocap'
import Button from '@/atoms/button/Button'
import { useMedia } from '@/hooks/useMedia'
import { RESOLUTIONS } from '@/utils/enums'
import { isBellowOrEqualResolution } from '@/utils/helpers'

const PresentationSlider = () => {
	const router = useRouter()
	const size = useMedia()

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
				{presentationSliderData.map(({ text, textColor, image, button = undefined }, index) => (
					<SwiperSlide key={`slider-${index}`}>
						<SC.SlideCard image={image}>
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
				))}
			</Swiper>
		</SC.PresentationSliderWrapper>
	)
}

export default PresentationSlider
