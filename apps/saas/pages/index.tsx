import {
  GraphQLMediaObjectTypes,
  GraphQLObjectTypes,
  ObjectTypes,
} from "@skylark-reference-apps/lib";
import {
  HomePage,
  HomepageItem,
  HomePageParsedRailItem,
  SkeletonPage,
} from "@skylark-reference-apps/react";
import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { ReactNode } from "react";
import { Carousel } from "../components/carousel";
import { DisplayError } from "../components/displayError";
import { MediaObjectFetcher } from "../components/mediaObjectFetcher";
import { SeasonRail, SetRail } from "../components/rails";
import { useHomepageSet } from "../hooks/useHomepageSet";
import { getSeoDataForObject, SeoObjectData } from "../lib/getPageSeoData";
import {
  convertGraphQLSetType,
  convertTypenameToEntertainmentType,
  getGraphQLImageSrc,
  getSynopsisByOrderForGraphQLObject,
  getTitleByOrderForGraphQLObject,
  sortEpisodesByNumber,
} from "../lib/utils";
import {
  Brand,
  Episode,
  Movie,
  Season,
  SetContent,
  ImageType,
  SkylarkSet,
  SetType,
} from "../types/gql";

const RailItemDataFetcher: React.FC<{
  uid: string;
  type: GraphQLObjectTypes | "";
  isPortrait: boolean;
  children(data: HomePageParsedRailItem): ReactNode;
}> = ({ uid, type, children }) => (
  <>
    {type && (
      <MediaObjectFetcher type={type} uid={uid}>
        {(object) => (
          <>
            {children({
              title: getTitleByOrderForGraphQLObject(object, [
                "title_short",
                "title",
              ]),
              synopsis: getSynopsisByOrderForGraphQLObject(object, [
                "synopsis_short",
                "synopsis",
              ]),
              image: getGraphQLImageSrc(object?.images, ImageType.Thumbnail),
              uid: object.uid,
              href: `/${
                object.__typename === "SkylarkSet"
                  ? convertGraphQLSetType(object?.type || "")
                  : convertTypenameToEntertainmentType(object.__typename)
              }/${object.uid}`,
              number:
                (object.__typename === "Episode" && object.episode_number) ||
                undefined,
            })}
          </>
        )}
      </MediaObjectFetcher>
    )}
  </>
);

const getContentForSetItem = (
  item: SkylarkSet | Episode | Movie | Brand | Season
): HomepageItem["content"] => {
  let content:
    | { uid: string; slug: string; self: ""; type: GraphQLMediaObjectTypes }[]
    | undefined;

  switch (item.__typename) {
    case "Season":
      content = item.episodes?.objects
        ?.sort(sortEpisodesByNumber)
        .map((episode) => ({
          uid: episode?.uid || "",
          slug: episode?.slug || "",
          self: "",
          type: "Episode",
        }));
      break;
    case "SkylarkSet":
      content = (item?.content?.objects as SetContent[])?.map(({ object }) => ({
        uid: object?.uid || "",
        slug: object?.slug || "",
        self: "",
        type: (object as Episode | Movie | Brand | Season)
          ?.__typename as GraphQLMediaObjectTypes,
      }));
      break;
    default:
      break;
  }

  return content || [];
};

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

  // return <Carousel uid={content && content.length > 0 && content[0].uid} />

  return (
    <>
      <NextSeo openGraph={{ images: seo.images }} />
      <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900 font-body">
      <SkeletonPage show={!!isLoading}>
        {content.map((item, index) => {
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

            if(item.type === SetType.Rail) {
              return <SetRail set={item} variant="landscape" />
            }
          }

          if(item.__typename === "Season") {
            return (
              <SeasonRail season={item} />
            )
          }

        return (
          <div className="my-6 w-full" key={item.uid}>
            {}
            {/* <Rail displayCount header={item.title}>
              {item.content.map((contentItem) => (
                <RailItemDataFetcher
                  isPortrait={(["collection"] as ObjectTypes[]).includes(
                    item.type
                  )}
                  key={`thumbnail-${contentItem.slug || contentItem.uid}`}
                  self={contentItem.self}
                  slug={contentItem.slug}
                  type={contentItem.type}
                  uid={contentItem.uid}
                >
                  {({ image, href, uid, title, synopsis, number }) => {
                    switch (item.type) {
                      case "collection":
                        return (
                          <CollectionThumbnail
                            backgroundImage={image}
                            contentLocation="below"
                            href={href}
                            key={uid}
                            title={title}
                          />
                        );
                      case "season":
                        return (
                          <EpisodeThumbnail
                            backgroundImage={image}
                            contentLocation="below"
                            description={synopsis}
                            href={href}
                            key={uid}
                            number={number}
                            title={title}
                          />
                        );
                      default:
                        return (
                          <MovieThumbnail
                            backgroundImage={image}
                            contentLocation="below"
                            href={href}
                            key={uid}
                            title={title}
                          />
                        );
                    }
                  }}
                </RailItemDataFetcher>
              ))}
            </Rail> */}
          </div>
        );
      })}
    </SkeletonPage>
  </div>
    </>
  );
};

export default Home;
