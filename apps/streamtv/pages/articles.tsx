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
    <div className="flex w-full flex-col justify-center bg-gray-900 py-20 font-body">
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
          <div className="flex flex-col items-center px-4">
            {articles.map(
              ({ uid, title, description, publish_date, images, slug }) => {
                const image = getGraphQLImageSrc(images, ImageType.Thumbnail);

                return (
                  <div
                    className="flex max-w-4xl flex-col items-center justify-center rounded bg-streamtv-primary px-4 py-8 shadow md:px-20 md:py-10"
                    key={uid}
                  >
                    <h3 className="mb-2 text-center font-display text-xl md:mb-4 md:text-3xl">
                      {title}
                    </h3>
                    {publish_date && (
                      <p className="-mt-2 mb-4 text-center text-sm text-gray-600 md:-mt-4 md:mb-8">
                        {dayjs(publish_date as string).format(
                          "dddd, D MMMM YYYY HH:mm",
                        )}
                      </p>
                    )}
                    {image && (
                      <div className="mb-4 flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={title || "the article"}
                          className="h-72 w-72 overflow-hidden object-cover"
                          src={addCloudinaryOnTheFlyImageTransformation(image, {
                            width: 600,
                          })}
                        />
                      </div>
                    )}
                    {description && <p className="mb-4">{description}</p>}
                    <Button
                      href={`/article/${uid}${slug ? `/${slug}` : ""}`}
                      size="sm"
                      text="Read Article"
                      variant="secondary"
                    />
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
