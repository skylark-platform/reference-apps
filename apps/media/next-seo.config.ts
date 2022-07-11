import { DefaultSeoProps } from "next-seo";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

const createDefaultSeo = (appTitle: string): DefaultSeoProps => ({
  dangerouslySetAllPagesToNoFollow: true,
  dangerouslySetAllPagesToNoIndex: true,
  defaultTitle: appTitle,
  titleTemplate: `${appTitle} | %s`,
  description: `${appTitle} - A showcase application build to demonstrate the power of Skylark. Visit https://www.skylarkplatform.com to learn more.`,
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: appUrl,
    site_name: appTitle,
  },
});

export default createDefaultSeo;
