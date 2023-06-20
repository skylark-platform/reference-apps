import { hasProperty } from "@skylark-reference-apps/lib";
import { Rail } from "@skylark-reference-apps/react";
import {
  ObjectTypes,
  Season,
  SetContent,
  SkylarkSet,
  StreamTVSupportedSetType,
} from "../types";
import { Thumbnail, ThumbnailVariant } from "./thumbnail";

const getThumbnailVariantFromSetType = (
  setType: SkylarkSet["type"]
): ThumbnailVariant => {
  if (setType === StreamTVSupportedSetType.RailInset) {
    return "landscape-inside";
  }

  if (setType === StreamTVSupportedSetType.RailWithSynopsis) {
    return "landscape-synopsis";
  }

  if (setType === StreamTVSupportedSetType.RailMovie) {
    return "landscape-movie";
  }

  if (
    setType === StreamTVSupportedSetType.RailPortrait ||
    setType === StreamTVSupportedSetType.Collection
  ) {
    return "portrait";
  }

  return "landscape";
};

export const SeasonRail = ({
  season,
  header,
  className,
}: {
  season: Season;
  header?: string;
  className?: string;
}) => (
  <Rail
    className={className}
    displayCount
    header={header || season.title || season.title_short || undefined}
  >
    {season.episodes?.objects?.map((object) =>
      object ? (
        <Thumbnail
          key={object.uid}
          objectType={ObjectTypes.Episode}
          uid={object.uid}
          variant="landscape-synopsis"
        />
      ) : (
        <></>
      )
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
            uid={object.uid}
            variant={variant}
          />
        ) : (
          <></>
        )
      )}
    </Rail>
  );
};
