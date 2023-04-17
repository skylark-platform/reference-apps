

import {
  SkeletonPage,
} from "@skylark-reference-apps/react";
import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { Carousel } from "../components/carousel";
import { DisplayError } from "../components/displayError";
import { SeasonRail, SetRail } from "../components/rails";
import { useHomepageSet } from "../hooks/useHomepageSet";
import { getSeoDataForObject, SeoObjectData } from "../lib/getPageSeoData";
import {
  Brand,
  Episode,
  Movie,
  Season,
  SetContent,
  SkylarkSet,
  SetType,
} from "../types/gql";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const seo = await getSeoDataForObject(
    "SkylarkSet",
    "streamtv_homepage",
    locale || ""
  );
  return {
    revalidate: 300,
    props: {
      seo,
    },
  };
};

const Home: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { data, isLoading, isError } = useHomepageSet();

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage='To power the homepage, you must create a Set object with the external_id "streamtv_homepage" with valid Availability. Currently, this page will only show Sets and Seasons. Alternatively, our customer success team can preload the StreamTV data into your acccount.'
      />
    );
  }

  const content = data?.content?.objects
    ? (data.content.objects as SetContent[])?.map(
        ({ object }) => object as Episode | Movie | Brand | Season | SkylarkSet
      )
    : [];

  return (
      <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900 font-body">
      <NextSeo openGraph={{ images: seo.images }} />
      <SkeletonPage show={!!isLoading}>
        <div className="w-full">
        {content.map((item, index) => {
          // Only the Set Types, Sliders or Rails will show on the Home Page - as well as Seasons
          if (item.__typename === "SkylarkSet") {

            if(item.type === SetType.Slider) {
              return (
                // If the carousel is the first item, add negative margin to make it appear through the navigation
                <div
                className={`h-[90vh] w-full md:h-[95vh] ${
                  index === 0 ? "-mt-48" : ""
                }`}
              >
                <Carousel key={item.uid} uid={item.uid} />
                </div>
              );
            }

            if(item.type?.startsWith("RAIL")) {
              return <SetRail className="my-6" set={item} />
            }
          }

          if(item.__typename === "Season") {
            return (
              <SeasonRail className="my-6" season={item} />
            )
          }
          return <></>
      })}
      </div>
    </SkeletonPage>
  </div>
  );
};

export default Home;
