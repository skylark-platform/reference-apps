import { SkeletonPage } from "@skylark-reference-apps/react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { Fragment } from "react";
import { Carousel } from "./carousel";
import { DisplayError } from "./displayError";
import { SeasonRail, SetRail } from "./rails";
import { GET_PAGE_SET } from "../graphql/queries";
import { useObject } from "../hooks/useObject";
import { SeoObjectData } from "../lib/getPageSeoData";
import {
  Brand,
  Episode,
  Movie,
  Season,
  SetContent,
  SkylarkSet,
  StreamTVSupportedSetType,
} from "../types";

const Page: NextPage<{
  slug: string;
  seo: SeoObjectData;
  notFoundMessage?: string;
}> = ({ slug, seo, notFoundMessage }) => {
  const { data, isLoading, isError } = useObject<SkylarkSet>(
    GET_PAGE_SET,
    slug
  );

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={notFoundMessage || `Page "${slug}" not found.`}
      />
    );
  }

  if (data && data.type !== StreamTVSupportedSetType.Page) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p className="mb-4 text-lg font-medium">{`Invalid SkylarkSet type ${
          data.type ? `"${data.type}"` : ""
        } used`}</p>
        <p className="max-w-md text-center text-sm">{`The requested SkylarkSet must be of type "${StreamTVSupportedSetType.Page}"`}</p>
      </div>
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
      <SkeletonPage show={isLoading && !data}>
        <div className="w-full">
          {content.map((item, index) => {
            // Only the Set Types, Sliders or Rails will show on the Home Page - as well as Seasons
            if (item.__typename === "SkylarkSet") {
              if (item.type === StreamTVSupportedSetType.Slider) {
                return (
                  // If the carousel is the first item, add negative margin to make it appear through the navigation
                  <div
                    className={`h-[90vh] w-full md:h-[95vh] ${
                      index === 0 ? "-mt-48" : ""
                    }`}
                    key={item.uid}
                  >
                    <Carousel uid={item.uid} />
                  </div>
                );
              }

              if (
                item.type &&
                [
                  StreamTVSupportedSetType.Rail,
                  StreamTVSupportedSetType.RailInset,
                  StreamTVSupportedSetType.RailMovie,
                  StreamTVSupportedSetType.RailPortrait,
                  StreamTVSupportedSetType.RailWithSynopsis,
                  StreamTVSupportedSetType.Collection,
                ].includes(item.type as StreamTVSupportedSetType)
              ) {
                return <SetRail className="my-6" key={item.uid} set={item} />;
              }
            }

            if (item.__typename === "Season") {
              return (
                <SeasonRail className="my-6" key={item.uid} season={item} />
              );
            }
            return <Fragment key={item.uid} />;
          })}
        </div>
      </SkeletonPage>
    </div>
  );
};

export default Page;
