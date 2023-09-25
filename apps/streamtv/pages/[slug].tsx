import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getSeoDataForObject, SeoObjectData } from "../lib/getPageSeoData";
import Page from "../components/pages/setTypes/page";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject(
    "SkylarkSet",
    context.query.slug as string,
    context.locale || "",
  );

  return {
    props: {
      seo,
    },
  };
};

const DynamicPage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();

  return <Page seo={seo} slug={query?.slug as string} />;
};

export default DynamicPage;
