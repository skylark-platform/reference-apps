import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { addCloudinaryOnTheFlyImageTransformation } from "@skylark-reference-apps/lib";
import { ParseAndDisplayHTML } from "@skylark-reference-apps/react";
import { ImageType, Person } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import { GET_PERSON } from "../../graphql/queries";
import { convertObjectImagesToSeoImages } from "../../lib/getPageSeoData";
import { getGraphQLImageSrc } from "../../lib/utils";

const PersonPage: NextPage = () => {
  const { query } = useRouter();
  const {
    data: person,
    isError,
    isLoading,
  } = useObject<Person>(GET_PERSON, query?.slug as string);

  console.log({ person });

  if (!isLoading && isError) {
    return (
      <DisplayError
        error={isError}
        notFoundMessage={`Person "${query?.slug as string}" not found.`}
      />
    );
  }

  const image = getGraphQLImageSrc(person?.images, ImageType.Poster);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-900 pb-20 font-body md:pt-64">
      <NextSeo
        description={
          person?.bio_short || person?.bio_medium || person?.bio_long || ""
        }
        openGraph={{
          images: convertObjectImagesToSeoImages(person?.images) || [],
        }}
        title={person?.name || person?.abbreviation || "Person"}
      />
      <div className="flex w-full max-w-5xl grid-cols-4 gap-20">
        <div>
          <div className="flex h-72 w-72 items-center justify-center overflow-hidden rounded-full bg-streamtv-primary">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={person?.name || "the person"}
                className="h-full w-full object-cover"
                src={addCloudinaryOnTheFlyImageTransformation(image, {
                  width: 600,
                })}
              />
            ) : (
              <p>{`No image`}</p>
            )}
          </div>
        </div>
        <div className="text-white">
          <h1 className="mb-4 font-display text-4xl">{person?.name}</h1>
          <ParseAndDisplayHTML
            fallbackMessage="No bio for this person"
            html={
              person?.bio_long ||
              person?.bio_medium ||
              person?.bio_short ||
              null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
