import type { NextPage } from "next";
import { useDimensions } from "@skylark-reference-apps/react";
import Page from "../components/pages/setTypes/page";
import { SeoObjectData } from "../lib/getPageSeoData";

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   const seo = await getSeoDataForObject(
//     "SkylarkSet",
//     "streamtv_homepage",
//     locale || "",
//   );
//   return {
//     revalidate: 300,
//     props: {
//       seo,
//     },
//   };
// };

const getHomePageId = (customerType: string) => {
  const normalised = customerType.toLocaleLowerCase();

  if (normalised === "premium") {
    return "coll_ae8d785f163a4ddfad844f0e8113b75e";
  }

  if (normalised === "standard") {
    return "coll_08b21c9ecf0143d49a404a42769fde27";
  }

  return "coll_d10eaf6059d74058873144a68809422e";
};

const Home: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const notFoundMessage =
    'To power the homepage, you must create a Set object with the external_id "streamtv_homepage" with valid Availability. Currently, this page will only show Sets and Seasons. Alternatively, our customer success team can preload the StreamTV data into your acccount.';

  const { dimensions } = useDimensions();

  const slug = getHomePageId(dimensions["customer-type"]);

  return <Page notFoundMessage={notFoundMessage} seo={seo} slug={slug} />;
};

export default Home;
