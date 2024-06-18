import type { GetStaticProps, NextPage } from "next";
import Page from "../components/pages/setTypes/page";
import { SeoObjectData, getSeoDataForObject } from "../lib/getPageSeoData";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const seo = await getSeoDataForObject(
    "SkylarkSet",
    "skylarktv_homepage",
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
  const notFoundMessage =
    'To power the homepage, you must create a Set object with the external_id "skylarktv_homepage" with valid Availability. Currently, this page will only show Sets and Seasons. Alternatively, our customer success team can preload the SkylarkTV data into your acccount.';

  return (
    <Page
      notFoundMessage={notFoundMessage}
      seo={seo}
      slug="skylarktv_homepage"
    />
  );
};

export default Home;
