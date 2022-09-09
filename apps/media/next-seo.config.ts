import { DefaultSeoProps } from "next-seo";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

const createDefaultSeo = (appTitle: string, description: string): DefaultSeoProps => ({
  dangerouslySetAllPagesToNoFollow: true,
  dangerouslySetAllPagesToNoIndex: true,
  defaultTitle: appTitle,
  titleTemplate: `%s | ${appTitle}`,
  description: `${appTitle} - ${description}`,
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: appUrl,
    site_name: appTitle,
  },
});

export default createDefaultSeo;
