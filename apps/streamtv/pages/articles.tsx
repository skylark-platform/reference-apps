import type { NextPage } from "next";

import { NextSeo } from "next-seo";
import { Button, H4, SkeletonPage } from "@skylark-reference-apps/react";
import useTranslation from "next-translate/useTranslation";
import dayjs from "dayjs";
import { addCloudinaryOnTheFlyImageTransformation } from "@skylark-reference-apps/lib";
import { DisplayError } from "../components/displayError";
import { useListObjects } from "../hooks/useListObjects";
import { LIST_ARTICLES } from "../graphql/queries";
import { Article, ImageType } from "../types";
import { getGraphQLImageSrc } from "../lib/utils";

const ArticlesPage: NextPage = () => {
  const {
    objects: articles,
    isError,
    isLoading,
  } = useListObjects<Article>(LIST_ARTICLES);

  const { t } = useTranslation("common");

  if (!isLoading && isError) {
    return (
      <DisplayError error={isError} notFoundMessage="No Articles found." />
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-900 py-20 font-body">
      <NextSeo title={t("articles")} />
      <div className="px-gutter sm:px-sm-gutter md:pt-20 lg:px-lg-gutter xl:px-xl-gutter">
        <div className="my-10 text-white">
          <h1 className="text-[40px] font-medium md:text-[56px]">
            {t("articles")}
          </h1>
        </div>
      </div>
      {!isLoading && (!articles || articles.length === 0) && (
        <div className="text-center">
          <H4 className="mb-0.5 mt-2 text-white">{`No ${t(
            "articles",
          )} found.`}</H4>
        </div>
      )}
      <SkeletonPage show={isLoading && !articles}>
        {articles && (
          <div className="grid max-w-5xl grid-cols-2 gap-10 px-4">
            {articles.map(
              ({
                uid,
                title,
                description,
                publish_date,
                images,
                slug,
                type,
              }) => {
                const image = getGraphQLImageSrc(images, ImageType.Thumbnail);

                return (
                  <div
                    className="flex max-w-4xl flex-col items-center justify-start rounded  px-4 py-4 shadow"
                    key={uid}
                  >
                    <div className="relative mb-4 flex h-56 w-full justify-start rounded-sm bg-gray-400">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={title || "the article"}
                          className="h-56 w-full overflow-hidden rounded-sm  object-cover"
                          src={addCloudinaryOnTheFlyImageTransformation(image, {
                            width: 600,
                          })}
                        />
                      )}
                      {type && (
                        <div className="absolute right-2 top-2 rounded-sm bg-streamtv-accent px-2 py-1 uppercase text-white">
                          {type}
                        </div>
                      )}
                    </div>
                    <h3 className="mb-2 w-full text-left font-display text-xl text-white md:mb-4 md:text-xl">
                      {title}
                    </h3>
                    {publish_date && (
                      <p className="-mt-1 mb-2 w-full text-left text-sm text-streamtv-accent md:-mt-2 md:mb-4">
                        {dayjs(publish_date as string).format(
                          "dddd, D MMMM YYYY HH:mm",
                        )}
                      </p>
                    )}

                    {description && (
                      <p className="mb-4 w-full text-left text-sm text-gray-300">
                        {description}
                      </p>
                    )}
                    <div className="mt-2 w-full">
                      <Button
                        href={`/article/${uid}${slug ? `/${slug}` : ""}`}
                        size="lg"
                        text="Read Article"
                        variant="secondary"
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </SkeletonPage>
    </div>
  );
};

export default ArticlesPage;
