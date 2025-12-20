import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import { store } from '@/stores/store'
import { SiteWrapperChild } from './SiteWrapperChild'

// Lazy load LoginModal - not needed for initial render
const LoginModal = dynamic(() => import('./LoginModal'), {
	ssr: false,
	loading: () => null,
})

interface SiteWrapperProviderProps {
	children: React.ReactNode
	__TEMPLATE_QUERY_DATA__: any
}

const SiteWrapperProvider: FC<SiteWrapperProviderProps> = ({
	children,
	...props
}) => {
	return (
		<Provider store={store}>
			{children}
			<SiteWrapperChild {...props} />
			<LoginModal />
		</Provider>
	)
}

export default SiteWrapperProvider
