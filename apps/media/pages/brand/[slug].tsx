import type { NextPage } from "next";
import Head from "next/head";
import { Carousel } from "@skylark-reference-apps/react";
import { Brand, ImageUrl } from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { useSingleObjectBySlug } from "../../hooks/useSingleObjectBySlug";

const BrandPage: NextPage = () => {
  const { query } = useRouter();

  const { data } = useSingleObjectBySlug("brand", query?.slug as string);
  const brand = data as Brand | undefined;

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
