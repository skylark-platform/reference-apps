import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { SkeletonPage } from "@skylark-reference-apps/react";
import { Season } from "@skylark-reference-apps/lib";

import { homepageSlug, useHomepageSet } from "../hooks/useHomepageSet";
import { getSeoDataForSet, SeoObjectData } from "../lib/getPageSeoData";
import { CollectionRail } from "../components/collectionRail";
import { SeasonRail } from "../components/seasonRail";
import { Slider } from "../components/slider";
import { MainRail } from "../components/rail";

export const getStaticProps: GetStaticProps = async () => {
  const seo = await getSeoDataForSet("homepage", homepageSlug);
  return {
    revalidate: 300,
    props: {
      seo,
    },
  };
};

const Home: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { homepage } = useHomepageSet();

  const homepageItems =
    (homepage?.isExpanded &&
      homepage?.items?.isExpanded &&
      homepage.items.objects) ||
    [];

  return (
    <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900">
      <NextSeo openGraph={{ images: seo.images }} />
      <SkeletonPage show={!homepage}>
        {homepageItems.map((item, index) => {
          if (item.isExpanded) {
            const key = `${item.self}-${item.slug}-${item.uid}-${item.objectTitle}`;
            if (item.type === "slider") {
              return (
                <Slider isFirstOnPage={index === 0} item={item} key={key} />
              );
            }

            return (
              <div className="my-6 w-full" key={key}>
                {item.type === "rail" && <MainRail section={item} />}
                {item.type === "collection" && (
                  <CollectionRail section={item} />
                )}
                {item.type === "season" && (
                  <SeasonRail season={item as Season} />
                )}
              </div>
            );
          }

          return <>{item.isExpanded && item.objectTitle}</>;
        })}
      </SkeletonPage>
    </div>
  );
};

export default Home;
