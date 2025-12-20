import SEO from "@/components/SEO/SEO";
import React, { FC } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "@/components/Footer/Footer";
import { FragmentType } from "@/__generated__";
import {
  NC_FOOTER_MENU_QUERY_FRAGMENT,
  NC_PRIMARY_MENU_QUERY_FRAGMENT,
} from "@/fragments/menu";
import { NcgeneralSettingsFieldsFragmentFragment } from "@/__generated__/graphql";

interface Props {
  children: React.ReactNode;
  pageTitle?: string | null | undefined;
  headerMenuItems?: FragmentType<typeof NC_PRIMARY_MENU_QUERY_FRAGMENT>[];
  footerMenuItems?: FragmentType<typeof NC_FOOTER_MENU_QUERY_FRAGMENT>[] | null;
  pageFeaturedImageUrl?: string | null | undefined;
  generalSettings?: NcgeneralSettingsFieldsFragmentFragment | null | undefined;
  pageDescription?: string | null | undefined;
  // New SEO props
  pageType?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string | null;
  section?: string | null;
}

const SITE_NAME = 'Cursed Tours';

const PageLayout: FC<Props> = ({
  children,
  footerMenuItems,
  headerMenuItems,
  pageFeaturedImageUrl,
  pageTitle,
  generalSettings,
  pageDescription,
  pageType = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
}) => {
  // Build proper title - handle homepage specially
  const isHomepage = !pageTitle || pageTitle === 'Home';
  const seoTitle = isHomepage 
    ? `${SITE_NAME} - Where History Haunts`
    : `${pageTitle} - ${SITE_NAME}`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={pageDescription || generalSettings?.description || ""}
        imageUrl={pageFeaturedImageUrl}
        type={pageType}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        author={author}
        section={section}
      />

      <SiteHeader
        siteTitle={generalSettings?.title}
        siteDescription={generalSettings?.description}
        menuItems={headerMenuItems || []}
      />

      <main id="main-content" role="main">
        {children}
      </main>

      <Footer menuItems={footerMenuItems || []} />
    </>
  );
};

export default PageLayout;
