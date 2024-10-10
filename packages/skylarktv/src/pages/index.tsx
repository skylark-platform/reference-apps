import type { GetStaticProps, NextPage } from "next";
import Page from "../components/pages/setTypes/page";
import { SeoObjectData, getSeoDataForObject } from "../lib/getPageSeoData";

const HOMEPAGE_EXTERNAL_ID =
  process.env.NEXT_PUBLIC_HOMEPAGE_EXTERNAL_ID || "streamtv_homepage";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const seo = await getSeoDataForObject(
    "SkylarkSet",
    HOMEPAGE_EXTERNAL_ID,
    locale || "",
  );
  return {
    revalidate: 300,
    props: {
      seo,
    },
  };
};

const Home: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const notFoundMessage = `To power the homepage, you must create a Set object with the external_id "${HOMEPAGE_EXTERNAL_ID}" with valid Availability. Currently, this page will only show Sets and Seasons. Alternatively, our customer success team can preload the SkylarkTV data into your acccount.`;

  return (
    <Page
      notFoundMessage={notFoundMessage}
      seo={seo}
      slug={HOMEPAGE_EXTERNAL_ID}
    />
  );
};

export default Home;
