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

  console.log({ page, content });
  return (
    <main
      className={clsx(
        "flex min-h-screen flex-col items-center justify-between gap-0 bg-white text-black",
        workSans.className,
      )}
    >
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

  console.log({ page });

  return { props: { page } };
}) satisfies GetStaticProps<{
  page: Page;
}>;
