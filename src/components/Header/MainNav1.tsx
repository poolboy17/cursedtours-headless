import { FC } from 'react'
import Navigation from '@/components/Navigation/Navigation'
import { NC_PRIMARY_MENU_QUERY_FRAGMENT } from '@/fragments/menu'
import { FragmentType } from '@/__generated__'
import AvatarDropdownLazy from './AvatarDropdownLazy'
import Brand from './Brand'
import CreateBtn from './CreateBtn'
import { SearchIconBtn } from './HeaderSearch'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'
import dynamic from 'next/dynamic'

const DynamicMenuBar = dynamic(() => import('@/components/MenuBar/MenuBar'), {
	ssr: false,
})

export interface MainNav1Props {
	menuItems: FragmentType<typeof NC_PRIMARY_MENU_QUERY_FRAGMENT>[]
	title?: string | null
	description?: string | null
}

const MainNav1: FC<MainNav1Props> = ({ menuItems, title, description }) => {
	return (
		<div className="nc-MainNav1 relative z-10 border-b border-neutral-200/70 bg-white dark:border-transparent dark:bg-neutral-900">
			<div className="container">
				<div className="flex h-16 items-center justify-between py-3 sm:h-20 sm:py-4">
					<div className="flex flex-1 items-center lg:hidden">
						<DynamicMenuBar menuItems={menuItems} />
					</div>

					<div className="flex flex-1 items-center justify-center space-x-4 sm:space-x-10 lg:justify-start 2xl:space-x-14 rtl:space-x-reverse">
						<Brand title={title} description={description} />

						<Navigation menuItems={menuItems} className="hidden lg:flex" />
					</div>

					<div className="flex flex-1 items-center justify-end space-x-1 text-neutral-700 rtl:space-x-reverse dark:text-neutral-100">
						<div className="hidden items-center lg:flex">
							{!NC_SITE_SETTINGS.site_header?.desktop_header
								?.hide_create_button && <CreateBtn />}
							<SearchIconBtn className="flex" />
							<AvatarDropdownLazy />
						</div>
						<div className="flex items-center lg:hidden">
							<SearchIconBtn className="flex" />
							<AvatarDropdownLazy />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MainNav1
