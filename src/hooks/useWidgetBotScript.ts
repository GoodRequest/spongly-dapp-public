/* eslint-disable */
import { breakpoints } from '@/styles/theme'
import { DISCORD_SPONGLY_CHANNEL, DISCORD_SPONGLY_SERVER, EXTERNAL_SCRIPTS } from '@/utils/constants'
import { useEffect } from 'react'

const useWidgetBotScript = (preventWidgetLoad: boolean) => {
	useEffect(() => {
		if (preventWidgetLoad) {
			return
		}

		if (document.getElementsByTagName('widgetbot-crate')) {
			const elements = document.getElementsByTagName('widgetbot-crate')
			const parentNode = elements[0]?.parentNode;
			for(let i = 0; i < elements.length; i++)
			{
				if (parentNode) {
					parentNode.removeChild(elements[0]);
				}
			}
		}

		const script = document.createElement('script')

		script.src = EXTERNAL_SCRIPTS.DISCORD_WIDGET
		script.async = true
		script.defer = true
		script.onload = () => {
			new (window as any).Crate({
				server: DISCORD_SPONGLY_SERVER,
				channel: DISCORD_SPONGLY_CHANNEL,
				css: `
                @media (max-width: ${breakpoints.semixxl}px) {
                    &:not(.open) .button {
                        margin-bottom: 70px;
                        width: 45px;
                        height: 45px;
                    }
                }
              `
			})
		}

		document.body.appendChild(script)

		return () => {
			document.body.removeChild(script)
		}
	}, [preventWidgetLoad])
}

export default useWidgetBotScript
