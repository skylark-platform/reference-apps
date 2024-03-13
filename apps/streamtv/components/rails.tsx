import { hasProperty } from "@skylark-reference-apps/lib";
import { Rail } from "@skylark-reference-apps/react";
import {
  Brand,
  CountrylineSet,
  Movie,
  ObjectTypes,
  Season,
  SetContent,
  SkylarkTag,
  StreamTVSupportedImageType,
} from "../types";
import {
  Thumbnail,
  ThumbnailVariant,
  getThumbnailVariantFromSetType,
} from "./thumbnail";

export const SeasonRail = ({
  season,
  header,
  className,
  preferredImageType,
}: {
  season: Season;
  header?: string;
  className?: string;
  preferredImageType?: StreamTVSupportedImageType;
}) => (
  <Rail
    className={className}
    displayCount
    header={
      header ||
      season.title_long ||
      season.title_medium ||
      season.title_short ||
      undefined
    }
  >
    {season.episodes?.objects?.map((object) =>
      object ? (
        <Thumbnail
          key={object.uid}
          objectType={ObjectTypes.Episode}
          preferredImageType={preferredImageType}
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
  set: CountrylineSet;
  className?: string;
}) => {
  const variant: ThumbnailVariant = getThumbnailVariantFromSetType(set.type);

  return (
    <Rail
      className={className}
      displayCount
      header={
        set.title_long || set.title_medium || set.title_short || undefined
      }
    >
      {(set.content?.objects as SetContent[])?.map(({ object }) =>
        // Without __typename, the Thumbnail will not know what query to use
        object && hasProperty(object, "__typename") ? (
          <Thumbnail
            key={object.uid}
            objectType={object.__typename as ObjectTypes}
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
