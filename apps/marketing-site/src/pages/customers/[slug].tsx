import { Work_Sans } from "next/font/google";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { graphQLClient } from "@skylark-reference-apps/lib";
import { gql } from "graphql-request";
import clsx from "clsx";
import Head from "next/head";
import { Banner } from "src/components/banner";
import { GET_TESTIMONIAL } from "src/queries/getTestimonial";
import { CopyComponent } from "src/components/copy";
import { PersonCard } from "src/components/personCard";
import { FirstValidImage } from "src/components/image";
import { Testimonial } from "../../../types/gql";

const workSans = Work_Sans({ subsets: ["latin"] });

export default function TestimonialPage({
  testimonial,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log({ testimonial });

  return (
    <main
      className={clsx(
        "flex min-h-screen flex-col items-center gap-0 bg-white pt-20 text-black",
        workSans.className,
      )}
    >
      <Head>
        <title>{testimonial?.title || "Skylark"}</title>
        {testimonial.description && (
          <meta
            content={testimonial.description}
            key="desc"
            name="description"
          />
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
      <div className="gutter mx-auto mb-10 max-w-5xl">
        <FirstValidImage
          className="mb-10 md:mb-20"
          images={testimonial.images?.objects}
        />
        <h1 className="text-5xl font-bold">{testimonial.title}</h1>

        {testimonial.people?.objects &&
          testimonial.people.objects.length > 0 && (
            <PersonCard person={testimonial.people.objects[0]} />
          )}

        <div className="my-10">
          <CopyComponent copy={testimonial.copy} />
        </div>
      </div>
    </main>
  );
}

export const getStaticPaths = (() => ({
  paths: [
    // {
    //   params: {
    //     slug: "macademia",
    //   },
    // }, // See the "paths" section below
  ],
  fallback: "blocking", // false or "blocking"
})) satisfies GetStaticPaths;

export const getStaticProps = (async () => {
  const { getTestimonial: testimonial } = await graphQLClient.request<{
    getTestimonial: Testimonial;
  }>(
    gql`
      ${GET_TESTIMONIAL}
    `,
    {
      externalId: "macademia",
    },
  );

  return {
    props: { testimonial },
    revalidate: 10, // In seconds
  };
}) satisfies GetStaticProps<{
  testimonial: Testimonial;
}>;
