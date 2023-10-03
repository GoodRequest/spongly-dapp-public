import styled from 'styled-components'
import { HeadingLGRegular, HeadingMDMedium, HeadingXSRegular } from '@/styles/typography'
import { breakpoints } from '@/styles/theme'

export const PresentationSliderWrapper = styled.div`
	background: ${({ theme }) => theme['color-base-surface-secondary']};
	border-radius: 12px;
	min-height: 392px;
	margin-bottom: 40px;
	${HeadingMDMedium}
	.swiper-pagination {
		position: absolute;
		width: fit-content;
		top: 0px;
		right: 48px;
		left: unset;
	}
	.swiper-pagination-bullet {
		width: 8px;
		height: 8px;
		.swiper-pagination-bullet-active {
			background-color: #6c78ed;
		}
	}

	@media (max-width: ${breakpoints.lg}px) {
		min-height: unset;
		height: 340px;

		.swiper-pagination {
			margin-bottom: -8px;
			right: 24px;
		}
	}

	@media (max-width: ${breakpoints.md}px) {
		height: 240px;
	}

	@media (max-width: ${breakpoints.sm}px) {
		height: 160px;
	}

	@media (max-width: ${breakpoints.smsx}px) {
		height: 300px;
	}
	@media (max-width: 370px) {
		height: 250px;
	}
`

export const SlideCard = styled.div<{ image: string }>`
	display: flex;
	width: 100%;
	height: 100%;
	max-height: 392px;
	border-radius: 12px;
	min-height: 392px;
	padding: 55px 64px;
	background-color: ${({ theme }) => theme['color-base-surface-secondary']};
	background-image: url('${({ image }) => image}');
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;

	@media (max-width: ${breakpoints.lg}px) {
		min-height: unset;
		height: 340px;
	}

	@media (max-width: ${breakpoints.md}px) {
		height: 260px;
	}

	@media (max-width: ${breakpoints.sm}px) {
		height: 180px;
	}
	@media (max-width: ${breakpoints.smsx}px) {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 300px;
	}
	@media (max-width: 370px) {
		height: 250px;
	}
`

export const SliderText = styled.div<{ textColor?: string }>`
	max-width: 352px;
	${HeadingLGRegular};
	color: ${({ textColor, theme }) => textColor || theme['color-base-content-top']};

	@media (max-width: ${breakpoints.sm}px) {
		margin-top: -40px;
		${HeadingXSRegular}
	}
`

export const SliderButton = styled.div`
	position: absolute;
	bottom: 24px;
	right: 24px;

	@media (max-width: ${breakpoints.md}px) {
		right: 24px;
		bottom: 12px;
	}

	@media (max-width: ${breakpoints.sm}px) {
		right: 24px;
		bottom: 12px;
	}

	@media (max-width: ${breakpoints.smsx}px) {
		right: unset;
		width: 90%;
		bottom: 20px;
	}
`
