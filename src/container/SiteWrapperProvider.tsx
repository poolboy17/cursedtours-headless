import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import { store } from '@/stores/store'

// Lazy load SiteWrapperChild - defers useAuth() and Apollo context access
// This significantly reduces initial JS execution and TBT on homepage
// Auth state will be available after hydration, which is fine because:
// - Like/Bookmark show static placeholders until interaction (Phase 1.5)
// - Auth-dependent features only matter after user interaction
const SiteWrapperChild = dynamic(
	() => import('./SiteWrapperChild').then((mod) => ({ default: mod.SiteWrapperChild })),
	{
		ssr: false,
		loading: () => null,
	}
)

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
