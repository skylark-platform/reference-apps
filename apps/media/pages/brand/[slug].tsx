import type { NextPage } from "next";
import Head from "next/head";
import {
  Carousel,
  EpisodeThumbnail,
  Rail,
} from "@skylark-reference-apps/react";
import { Episode, ImageUrl, getImageSrc } from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useBrandWithSeasonBySlug } from "../../hooks/useBrandWithSeasonBySlug";

const BrandPage: NextPage = () => {
  const { query } = useRouter();

  const { brand } = useBrandWithSeasonBySlug(query?.slug as string);
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

      {brand &&
        brand.items?.map(
          (season) =>
            season.isExpanded &&
            season.type === "season" && (
              <div
                className="my-6 w-full"
                key={season.number || season.objectTitle || season.slug}
              >
                <Rail displayCount header={`Season ${season.number || "-"}`}>
                  {(season.items as Episode[])
                    .filter((ep) => ep.isExpanded && ep.type === "episode")
                    .sort((a: Episode, b: Episode) =>
                      (a.number || 0) > (b.number || 0) ? 1 : -1
                    )
                    .map((ep: Episode) => (
                      <EpisodeThumbnail
                        backgroundImage={getImageSrc(
                          ep.images,
                          "Thumbnail",
                          "250x250"
                        )}
                        description={
                          ep.synopsis?.medium || ep.synopsis?.short || ""
                        }
                        href={`/episode/${ep.slug}`}
                        key={ep.objectTitle}
                        number={ep.number || 0}
                        title={
                          ep?.title?.short ||
                          ep?.title?.medium ||
                          ep.objectTitle ||
                          ""
                        }
                      />
                    ))}
                </Rail>
              </div>
            )
        )}
      {!brand && <p>{`Loading ${query?.slug as string}`}</p>}
    </div>
  );
};

export default BrandPage;
