import { Inter } from "next/font/google";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { GET_PAGE } from "src/queries/getPage";
import { gql } from "graphql-request";
import { Page } from "../../types/gql";

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {page.seo_title}
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
