import type { NextPage } from "next";
import Head from "next/head";
import { Carousel } from "@skylark-reference-apps/react";
import useSWR from "swr";
import {
  SKYLARK_API,
  ApiResponseBrandWithSeasonsAndEpisodes,
  Brand,
  Season,
  Episode,
  ImageUrl,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";

const brandBySlugFetcher = (brandSlug: string) =>
  fetch(
    `${SKYLARK_API}/api/brands/?slug=${brandSlug}&fields_to_expand=items,image_urls,items__items,items__items__image_urls&fields=items,title,slug,title_short,image_urls,items__title_medium,items__season_number,items__year,items__items,items__items__image_urls,items__items__title_short,items__items__synopsis_medium,items__items__synopsis_long,items__items__episode_number,items__items__slug,items__items__uid`
  )
    .then((r) => r.json())
    .then((res: ApiResponseBrandWithSeasonsAndEpisodes) => {
      const [brand] = res.objects;
      const parsedBrand: Brand = {
        self: brand.self,
        isExpanded: true,
        type: "brand",
        objectTitle: brand.title,
        slug: brand.slug,
        uid: "",
        title: {
          short: brand.title_short,
          medium: brand.title_medium,
          long: brand.title_long,
        },
        images: brand.image_urls?.map(
          ({ image_type, url, url_path, self }) => ({
            self,
            isExpanded: true,
            type: image_type,
            url,
            urlPath: url_path,
          })
        ),
        items: brand.items.map(
          (season): Season => ({
            type: "season",
            isExpanded: true,
            self: season.self,
            uid: "",
            objectTitle: season.title,
            slug: "",
            number: season.season_number,
            releaseDate: `${season.year || ""}`,
            items: season.items.map(
              (episode): Episode => ({
                isExpanded: true,
                self: episode.self,
                objectTitle: episode.title,
                type: "episode",
                number: episode.episode_number,
                title: {
                  short: episode.title_short,
                  medium: episode.title_medium,
                  long: episode.title_long,
                },
                synopsis: {
                  short: episode.synopsis_short,
                  medium: episode.synopsis_medium,
                  long: episode.synopsis_long,
                },
                slug: episode.slug,
                uid: episode.uid,
                images: episode.image_urls?.map(
                  ({ image_type, url, url_path, self }) => ({
                    type: image_type,
                    url,
                    urlPath: url_path,
                    self,
                    isExpanded: true,
                  })
                ),
              })
            ),
          })
        ),
      };
      return parsedBrand;
    });

const BrandPage: NextPage = () => {
  const { query } = useRouter();

  const { data: brand } = useSWR<Brand, any>(query?.slug, brandBySlugFetcher);

  return (
    <div className="mb-20 flex min-h-screen flex-col items-center bg-gray-900">
      <Head>
        <title>{`Skylark Media Reference App`}</title>
      </Head>

      <div className="h-[90vh] w-full md:h-[95vh]">
        {/* Use Carousel until brand components are ready */}
        <Carousel
          items={[
            {
              uid: "",
              href: "",
              title: "",
              type: "brand",
              releaseDate: "",
              image: brand?.images
                ? ((brand.images as ImageUrl[]).find(
                    (image) => image.isExpanded && image.type === "Main"
                  )?.url as string)
                : "",
            },
          ]}
        />
      </div>

      {/* {brand &&
        brand.items?.map(
          (item) =>
            item.type === "season" && (
              <div className="my-6 w-full" key={item.number || item.objectTitle || item.slug}>
                <Rail displayCount header={`Season ${item.number || "-"}`}>
                  {item.isExpanded && (item.items as Episode[]).filter((ep) => ep.isExpanded)
                    .sort((a: Episode, b: Episode) =>
                      (a.number || 0) > (b.number || 0) ? 1 : -1
                    )
                    .map((ep: Episode) => (
                      <EpisodeThumbnail
                        backgroundImage={`${
                          ep.images?.find((image) => image.type === "Thumbnail")
                            ?.url || ""
                        }`}
                        description={
                          ep.synopsis?.medium || ep.synopsis?.short || ""
                        }
                        href={`/player/${ep.uid}`}
                        key={ep.objectTitle}
                        number={ep.number || 0}
                        title={
                          ep?.title?.short ||
                          ep?.title?.medium ||
                          ep.objectTitle || ""
                        }
                      />
                    ))}
                </Rail>
              </div>
            )
        )} */}
      {!brand && <p>{`Loading ${query?.slug as string}`}</p>}
    </div>
  );
};

export default BrandPage;
