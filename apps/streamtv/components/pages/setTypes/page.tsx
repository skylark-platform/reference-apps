import { SkeletonPage } from "@skylark-reference-apps/react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { Fragment } from "react";
import { Carousel } from "../../carousel";
import { DisplayError } from "../../displayError";
import { SeasonRail, SetRail, TagRail } from "../../rails";
import { GET_PAGE_SET } from "../../../graphql/queries";
import { useObject } from "../../../hooks/useObject";
import {
  SeoObjectData,
  convertObjectImagesToSeoImages,
} from "../../../lib/getPageSeoData";
import {
  Brand,
  CallToAction,
  CountrylineSet,
  Episode,
  Metadata,
  Movie,
  Season,
  SetContent,
  SkylarkSet,
  SkylarkTag,
  StreamTVAdditionalFields,
  StreamTVSupportedImageType,
  StreamTVSupportedSetType,
} from "../../../types";
import { Grid } from "../../grid";
import { getThumbnailVariantFromSetType } from "../../thumbnail";
import { useSkylarkEnvironment } from "../../../hooks/useSkylarkEnvironment";
import { CTA } from "../../cta";

const Page: NextPage<{
  slug: string;
  seo?: SeoObjectData;
  notFoundMessage?: string;
}> = ({ slug, seo, notFoundMessage }) => {
  const { environment } = useSkylarkEnvironment();

  const { data, isLoading, isError } = useObject<SkylarkSet>(
    GET_PAGE_SET(environment.hasUpdatedSeason),
    slug,
  );

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={notFoundMessage || `Page "${slug}" not found.`}
      />
    );
  }

  const type = typeof data?.type === "string" ? data.type : "";

  if (
    data &&
    !(
      [
        StreamTVSupportedSetType.Page,
        StreamTVSupportedSetType.HomePage,
      ] as string[]
    ).includes(type)
  ) {
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
        ({ object }) =>
          object as
            | Episode
            | Movie
            | Brand
            | Season
            | SkylarkSet
            | CountrylineSet
            | CallToAction
            | SkylarkTag,
      )
    : [];

  return (
    <div className="mb-20 mt-48 flex min-h-screen flex-col items-center bg-gray-900 font-body">
      <NextSeo
        openGraph={{
          images:
            convertObjectImagesToSeoImages(data?.images) || seo?.images || [],
        }}
      />
      <SkeletonPage show={isLoading && !data}>
        <div className="w-full">
          {content.map((item, index) => {
            // Only the Set Types, Sliders or Rails will show on the Home Page - as well as Seasons

            // preferred_image_type is a field that would only be added if the StreamTV ingest has been run
            // So we add it manually to ensure that the codegen doesn't affect StreamTV's without the ingest
            // Field added in packages/ingestor/src/lib/skylark/saas/schema.ts
            const preferredImageType = (
              item as {
                [StreamTVAdditionalFields.PreferredImageType]?: StreamTVSupportedImageType;
              }
            )?.[StreamTVAdditionalFields.PreferredImageType];

            if (item.__typename === "CountrylineSet") {
              if (item.type === StreamTVSupportedSetType.Slider) {
                return (
                  // If the carousel is the first item, add negative margin to make it appear through the navigation
                  <div
                    className={`h-[88vh] w-full md:h-[95vh] ${
                      index === 0 ? "-mt-48" : ""
                    }`}
                    key={item.uid}
                  >
                    <Carousel uid={item.uid} />
                  </div>
                );
              }

              if (
                item.type === StreamTVSupportedSetType.Grid ||
                item.type === StreamTVSupportedSetType.GridPortrait
              ) {
                const objects = (
                  item?.content?.objects as SetContent[] | undefined
                )
                  ?.map(({ object }) => object)
                  .filter((object) => !!object) as Metadata[];
                return (
                  <Grid
                    className="my-6"
                    header={
                      item.title_long ||
                      item.title_medium ||
                      item.title_short ||
                      undefined
                    }
                    key={item.uid}
                    objects={objects}
                    variant={getThumbnailVariantFromSetType(item.type)}
                  />
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
                <SeasonRail
                  className="my-6"
                  key={item.uid}
                  preferredImageType={preferredImageType}
                  season={item}
                />
              );
            }

            if (item.__typename === "SkylarkTag") {
              return <TagRail key={item.uid} tag={item} />;
            }

            if (item.__typename === "CallToAction") {
              return <CTA key={item.uid} uid={item.uid} />;
            }

            return <Fragment key={item.uid} />;
          })}
        </div>
      </SkeletonPage>
    </div>
  );
};

export default Page;
