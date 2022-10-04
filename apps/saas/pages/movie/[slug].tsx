import type { GetServerSideProps, NextPage } from "next";
import { PlaybackPage } from "@skylark-reference-apps/react";
import {
  getSynopsisByOrder,
  getTitleByOrder,
} from "@skylark-reference-apps/lib";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useSingleObject } from "../../hooks/useSingleObject";
import { getSeoDataForObject, SeoObjectData } from "../../lib/getPageSeoData";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seo = await getSeoDataForObject("Movie", context.query.slug as string);

  return {
    props: {
      seo,
    },
  };
};

const MoviePage: NextPage<{ seo: SeoObjectData }> = ({ seo }) => {
  const { query } = useRouter();
  const { data: movie, isError } = useSingleObject(
    "Movie",
    (query?.slug as string) || "recLa35g2nEPBVqKp"
  );

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <p>{`Error fetching movie: ${(query?.slug as string) || ""}`}</p>
        <p>{isError.message}</p>
      </div>
    );
  }

  const title = getTitleByOrder({
    short: movie?.title_short || "",
    medium: movie?.title_medium || "",
    long: movie?.title_long || "",
  });

  const firstBrand =
    movie?.brands?.objects &&
    movie?.brands?.objects.length > 0 &&
    movie?.brands?.objects[0];

  const brandTitle = firstBrand
    ? getTitleByOrder({
        short: firstBrand.title_short || "",
        medium: firstBrand.title_medium || "",
        long: firstBrand.title_long || "",
      })
    : "";

  const synopsis = getSynopsisByOrder({
    short: movie?.synopsis_short || "",
    medium: movie?.synopsis_medium || "",
    long: movie?.synopsis_long || "",
  });

  return (
    <>
      <NextSeo
        description={seo.synopsis}
        openGraph={{ images: seo.images }}
        title={title || seo.title}
      />
      <PlaybackPage
        brand={{
          title: brandTitle,
        }}
        credits={{
          actors:
            movie?.credits?.objects
              ?.filter(
                (credit) => credit?.roles?.objects?.[0]?.title === "Actor"
              )
              ?.map((credit) =>
                credit?.character && credit?.people?.objects?.[0]?.name
                  ? `${credit?.people?.objects?.[0]?.name} as ${credit?.character}`
                  : credit?.people?.objects?.[0]?.name || ""
              ) || [],
          writers:
            movie?.credits?.objects
              ?.filter(
                (credit) => credit?.roles?.objects?.[0]?.title === "Writer"
              )
              ?.map((credit) =>
                credit?.character && credit?.people?.objects?.[0]?.name
                  ? `${credit?.people?.objects?.[0]?.name} as ${credit?.character}`
                  : credit?.people?.objects?.[0]?.name || ""
              ) || [],
          directors:
            movie?.credits?.objects
              ?.filter(
                (credit) => credit?.roles?.objects?.[0]?.title === "Director"
              )
              ?.map((credit) =>
                credit?.character && credit?.people?.objects?.[0]?.name
                  ? `${credit?.people?.objects?.[0]?.name} as ${credit?.character}`
                  : credit?.people?.objects?.[0]?.name || ""
              ) || [],
        }}
        genres={
          movie?.genres?.objects?.map((genre) =>
            genre && genre.name ? genre.name : ""
          ) || []
        }
        loading={!movie}
        player={{
          assetId: "1",
          poster:
            (
              movie?.images?.objects?.find(
                (img) => img?.image_type === "Poster"
              ) || movie?.images?.objects?.[0]
            )?.image_url || "",
          src: "/mux-video-intro.mp4",
          duration: 58, // TODO read this from asset
        }}
        rating={movie?.ratings?.objects?.[0]?.value}
        // releaseDate={movie?.releaseDate}
        synopsis={synopsis}
        themes={
          movie?.themes?.objects?.map((genre) =>
            genre && genre.name ? genre.name : ""
          ) || []
        }
        title={title}
      />
    </>
  );
};

export default MoviePage;
