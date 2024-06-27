import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { addCloudinaryOnTheFlyImageTransformation } from "@skylark-reference-apps/lib";
import { ParseAndDisplayHTML } from "@skylark-reference-apps/react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import { Episode, ImageType, Movie, Person } from "../../types/gql";
import { DisplayError } from "../../components/displayError";
import { useObject } from "../../hooks/useObject";
import {
  GET_PERSON,
  GET_PERSON_FOR_RELATED_CREDITS,
} from "../../graphql/queries";
import { convertObjectImagesToSeoImages } from "../../lib/getPageSeoData";
import { getGraphQLImageSrc } from "../../lib/utils";
import { GridWithSelfFetch } from "../../components/grid";

const PersonPage: NextPage = () => {
  const { query } = useRouter();

  const { t } = useTranslation("common");

  const {
    data: person,
    isError,
    isLoading,
  } = useObject<Person>(GET_PERSON, query?.slug as string);

  const { data: personCreditData } = useObject<Person>(
    GET_PERSON_FOR_RELATED_CREDITS,
    person?.uid || (query?.slug as string),
  );

  const otherCredits = personCreditData?.credits?.objects
    ?.map((credit) => [
      ...(credit?.movies?.objects || []),
      ...(credit?.episodes?.objects || []),
    ])
    .flatMap((arr) => arr)
    .filter((obj): obj is Movie | Episode => !!obj);

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
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-gray-900 pb-20 pt-20 font-body md:pt-64">
      <NextSeo
        description={
          person?.bio_short || person?.bio_medium || person?.bio_long || ""
        }
        openGraph={{
          images: convertObjectImagesToSeoImages(person?.images) || [],
        }}
        title={person?.name || person?.abbreviation || "Person"}
      />
      <div className="mb-20 flex w-full grid-cols-4 flex-col gap-4 md:max-w-5xl md:flex-row md:gap-20">
        <div>
          <div className="mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-full bg-skylarktv-primary md:m-0 md:h-72 md:w-72">
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
        <div className="mx-4 text-white">
          <h1 className="mb-2 text-center font-display text-4xl md:text-left">
            {person?.name}
          </h1>
          <p className="text-sm text-gray-400">
            {person &&
              `Born ${
                person.date_of_birth &&
                dayjs(person.date_of_birth as string, "YYYY-MM-DDZ").format(
                  "DD MMMM YYYY",
                )
              }${person?.place_of_birth && ` in ${person.place_of_birth}`}.`}
          </p>
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
      {person && otherCredits && (
        <GridWithSelfFetch
          fetchAdditionalRelationships
          header={t("more-from", { name: person.name })}
          objects={otherCredits}
          variant="credit"
        />
      )}
    </div>
  );
};

export default PersonPage;
