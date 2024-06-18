import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  ParseAndDisplayHTML,
  SkeletonPage,
} from "@skylark-reference-apps/react";
import dayjs from "dayjs";
import { Article } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import {
  SeoObjectData,
  convertObjectImagesToSeoImages,
  getSeoDataForObject,
} from "../../lib/getPageSeoData";
import { GET_ARTICLE } from "../../graphql/queries/getArticle";
import {
  getUidAndSlugFromQuery,
  useAddSlugToObjectUrl,
  useUidAndSlugFromObjectUrl,
} from "../../hooks/useUidAndSlugFromObjectUrl";
import { ListObjectsRail } from "../../components/rails";
import { LIST_ARTICLES } from "../../graphql/queries";

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params) {
    const { uid } = getUidAndSlugFromQuery(params);

    const seo = await getSeoDataForObject("Article", uid as string);

    return {
      props: {
        seo,
      },
      revalidate: 10,
    };
  }

  return {
    props: {
      seo: {},
    },
    revalidate: 10,
  };
};

const ArticlePage: NextPage<{ seo?: SeoObjectData }> = ({ seo }) => {
  const { uid } = useUidAndSlugFromObjectUrl();

  const {
    data: article,
    isError,
    isLoading,
  } = useObject<Article>(GET_ARTICLE, uid || "");

  const canonical = useAddSlugToObjectUrl(article);

  if (isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={`Article "${uid as string}" not found.`}
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-gray-900 pb-20 pt-4 font-body md:pt-48">
      <NextSeo
        canonical={canonical?.url}
        description={article?.description || seo?.synopsis || ""}
        openGraph={{
          images:
            convertObjectImagesToSeoImages(article?.images) ||
            seo?.images ||
            [],
        }}
        title={article?.title || seo?.title || "article"}
      />
      <SkeletonPage show={isLoading}>
        <div className="mx-4 flex w-full flex-col items-center px-4 text-white md:max-w-5xl">
          <h1 className="mb-4 rounded-sm bg-skylarktv-accent p-4 text-center font-display text-xl md:p-10 md:text-left md:text-4xl">
            {article?.title}
          </h1>
          {article?.publish_date && (
            <p>
              {dayjs(article.publish_date as string).format(
                "dddd, D MMMM YYYY HH:mm",
              )}
            </p>
          )}
          <div className="mt-5 md:mt-10">
            <ParseAndDisplayHTML
              fallbackMessage="Article has no body"
              html={article?.body || null}
            />
          </div>
        </div>
        <h4 className="mt-10 text-left text-2xl text-white">{`Continue Reading...`}</h4>
        <ListObjectsRail
          listObjectQuery={LIST_ARTICLES}
          thumbnailVariant="article"
          uidToFilter={uid}
        />
      </SkeletonPage>
    </div>
  );
};

export default ArticlePage;
