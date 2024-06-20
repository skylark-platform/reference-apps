import { hasProperty } from "@skylark-reference-apps/lib";
import { Rail } from "@skylark-reference-apps/react";
import useTranslation from "next-translate/useTranslation";
import {
  Brand,
  Movie,
  ObjectTypes,
  Person,
  Season,
  SetContent,
  SkylarkSet,
  SkylarkTag,
  SkylarkTVSupportedImageType,
} from "../types";
import {
  Thumbnail,
  ThumbnailVariant,
  getThumbnailVariantFromSetType,
} from "./thumbnail";
import { useListObjects } from "../hooks/useListObjects";
import { useObject } from "../hooks/useObject";
import { GET_PERSON_FOR_RELATED_CREDITS } from "../graphql/queries";

export const SeasonRail = ({
  season,
  header,
  className,
  preferredImageType,
}: {
  season: Season;
  header?: string;
  className?: string;
  preferredImageType?: SkylarkTVSupportedImageType;
}) => (
  <Rail
    className={className}
    displayCount
    header={header || season.title || season.title_short || undefined}
    id={season.season_number ? `season-${season.season_number}` : undefined}
  >
    {season.episodes?.objects?.map((object) =>
      object ? (
        <Thumbnail
          key={object.uid}
          objectType={ObjectTypes.Episode}
          preferredImageType={preferredImageType}
          slug={object.slug}
          uid={object.uid}
          variant="landscape-synopsis"
        />
      ) : (
        <></>
      ),
    )}
  </Rail>
);

export const SetRail = ({
  set,
  className,
}: {
  set: SkylarkSet;
  className?: string;
}) => {
  const variant: ThumbnailVariant = getThumbnailVariantFromSetType(set.type);

  return (
    <Rail
      className={className}
      displayCount
      header={set.title || set.title_short || undefined}
    >
      {(set.content?.objects as SetContent[])?.map(({ object }) =>
        // Without __typename, the Thumbnail will not know what query to use
        object && hasProperty(object, "__typename") ? (
          <Thumbnail
            key={object.uid}
            objectType={object.__typename as ObjectTypes}
            slug={object.slug}
            uid={object.uid}
            variant={variant}
          />
        ) : null,
      )}
    </Rail>
  );
};

export const TagRail = ({
  tag,
  className,
}: {
  tag: SkylarkTag;
  className?: string;
}) => {
  const movies =
    tag.movies?.objects?.filter((obj): obj is Movie => !!obj) || [];
  const brands =
    tag.brands?.objects?.filter((obj): obj is Brand => !!obj) || [];

  const objects = [...brands, ...movies];

  return (
    <Rail className={className} displayCount>
      {objects?.map((object) =>
        // Without __typename, the Thumbnail will not know what query to use
        object && hasProperty(object, "__typename") ? (
          <Thumbnail
            key={object.uid}
            objectType={object.__typename as ObjectTypes}
            slug={object.slug}
            uid={object.uid}
            variant={"landscape-synopsis"}
          />
        ) : (
          <></>
        ),
      )}
    </Rail>
  );
};

export const ListObjectsRail = ({
  listObjectQuery,
  thumbnailVariant,
  uidToFilter,
  className,
}: {
  listObjectQuery: string;
  thumbnailVariant: ThumbnailVariant;
  uidToFilter?: string | null;
  className?: string;
}) => {
  const { objects } = useListObjects(listObjectQuery);

  const filteredObjects = uidToFilter
    ? objects?.filter((obj) => obj.uid !== uidToFilter)
    : objects;

  return (
    <Rail className={className} displayCount>
      {filteredObjects?.map((object) =>
        // Without __typename, the Thumbnail will not know what query to use
        object && hasProperty(object, "__typename") ? (
          <Thumbnail
            key={object.uid}
            objectType={object.__typename as ObjectTypes}
            slug={object.slug}
            uid={object.uid}
            variant={thumbnailVariant}
          />
        ) : (
          <></>
        ),
      )}
    </Rail>
  );
};

export const ListPersonOtherCreditsRail = ({
  uid,
  originalObjectUid,
}: {
  uid: string;
  originalObjectUid: string;
}) => {
  const { t } = useTranslation("common");

  const {
    data: person,
    isError,
    isLoading,
  } = useObject<Person>(GET_PERSON_FOR_RELATED_CREDITS, uid);

  const otherCredits = person?.credits?.objects
    ?.map((credit) => [
      ...(credit?.movies?.objects || []),
      ...(credit?.episodes?.objects || []),
    ])
    .flatMap((arr) => arr)
    .filter(
      (obj, index, arr) =>
        obj &&
        obj.uid !== originalObjectUid &&
        arr.findIndex((o) => o?.uid === obj.uid) === index,
    );

  return (
    <>
      {!isLoading && !isError && person && person.name && (
        <Rail header={t("more-from", { name: person.name })}>
          {otherCredits?.map((object) =>
            object && hasProperty(object, "__typename") ? (
              <Thumbnail
                key={object.uid}
                objectType={object.__typename as ObjectTypes}
                slug={object.slug}
                uid={object.uid}
                variant="landscape-synopsis"
              />
            ) : (
              <></>
            ),
          )}
        </Rail>
      )}
    </>
  );
};
