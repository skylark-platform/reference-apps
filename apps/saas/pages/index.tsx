import {
  GraphQLMediaObjectTypes,
  GraphQLObjectTypes,
  ObjectTypes,
} from "@skylark-reference-apps/lib";
import {
  HomePage,
  HomepageItem,
  HomePageParsedRailItem,
} from "@skylark-reference-apps/react";
import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { ReactNode } from "react";
import { DisplayError } from "../components/displayError";
import { MediaObjectFetcher } from "../components/mediaObjectFetcher";
import { SliderDataFetcher } from "../components/sliderDataFetcher";
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
  Set,
  ImageType,
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
                "short",
                "medium",
              ]),
              synopsis: getSynopsisByOrderForGraphQLObject(object, [
                "short",
                "medium",
                "long",
              ]),
              image: getGraphQLImageSrc(object?.images, ImageType.Thumbnail),
              uid: object.uid,
              href: `/${
                object.__typename === "Set"
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
  item: Set | Episode | Movie | Brand | Season
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
    case "Set":
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
    "Set",
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
        ({ object }) => object as Episode | Movie | Brand | Season | Set
      )
    : [];

  return (
    <>
      <NextSeo openGraph={{ images: seo.images }} />
      <HomePage
        RailItemDataFetcher={RailItemDataFetcher}
        SliderDataFetcher={SliderDataFetcher}
        items={content.map((item) => ({
          uid: item.uid,
          type: (
            (item as Set).type || item.__typename
          )?.toLowerCase() as ObjectTypes,
          self: "",
          title:
            getTitleByOrderForGraphQLObject(item, ["short", "medium"]) ||
            item.title ||
            "",
          content: getContentForSetItem(item),
        }))}
        loading={isLoading}
      />
    </>
  );
};

export default Home;
