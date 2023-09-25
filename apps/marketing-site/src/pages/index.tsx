import { Work_Sans } from "next/font/google";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { GET_PAGE } from "src/queries/getPage";
import { gql } from "graphql-request";
import clsx from "clsx";
import { Fragment } from "react";
import { BlockComponent } from "src/components/block";
import { SectionComponent } from "src/components/section";
import { CTAComponent } from "src/components/cta";
import { EmbedComponent } from "src/components/embed";
import Head from "next/head";
import { Banner } from "src/components/banner";
import {
  Block,
  CallToAction,
  Embed,
  Page,
  Section,
  SetContent,
} from "../../types/gql";

const workSans = Work_Sans({ subsets: ["latin"] });

export default function Home({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const content = page?.content?.objects
    ? (page.content.objects as SetContent[])?.map(
        ({ object }) => object as Block | CallToAction | Section | Embed,
      )
    : [];

  return (
    <main
      className={clsx(
        "flex min-h-screen flex-col items-center justify-between gap-0 bg-white pt-20 text-black",
        workSans.className,
      )}
    >
      <Head>
        <title>{page.seo_title || "Skylark"}</title>
        {page.seo_description && (
          <meta content={page.seo_description} key="desc" name="description" />
        )}
        <meta content="initial-scale=1.0, width=device-width" name="viewport" />
        <link
          href="/favicons/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicons/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicons/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/favicons/site.webmanifest" rel="manifest" />
        <link href="/favicons/favicon.ico" rel="icon" />
      </Head>
      <Banner />
      {content?.map((object, index) => {
        if (object.__typename === "Block") {
          return <BlockComponent block={object} key={object.uid} />;
        }

        if (object.__typename === "Section") {
          return <SectionComponent key={object.uid} section={object} />;
        }

        if (object.__typename === "CallToAction") {
          return <CTAComponent cta={object} key={object.uid} />;
        }

        if (object.__typename === "Embed") {
          return <EmbedComponent embed={object} key={object.uid} />;
        }

        return <Fragment key={object.uid || index} />;
      })}
    </main>
  );
}

export const getStaticProps = (async () => {
  const { getPage: page } = await graphQLClient.request<{ getPage: Page }>(gql`
    ${GET_PAGE}
  `);

  return {
    props: { page },
    revalidate: 10, // In seconds
  };
}) satisfies GetStaticProps<{
  page: Page;
}>;
