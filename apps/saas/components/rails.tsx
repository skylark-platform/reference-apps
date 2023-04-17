import { hasProperty } from "@skylark-reference-apps/lib";
import { Rail } from "@skylark-reference-apps/react";
import { sortEpisodesByNumber } from "../lib/utils";
import { ObjectTypes, Season, SetContent, SkylarkSet } from "../types";
import { Thumbnail, ThumbnailVariant } from "./thumbnail";

export const SeasonRail = ({ season }: { season: Season }) => (
  <Rail displayCount header={season.title || season.title_short || undefined}>
    {season.episodes?.objects?.sort(sortEpisodesByNumber).map((object) =>
      object ? (
        <Thumbnail
          key={object.uid}
          objectType={ObjectTypes.Episode}
          uid={object.uid}
          variant="landscape-description"
        />
      ) : (
        <></>
      )
    )}
  </Rail>
);


export const SetRail = ({ set, variant }: { set: SkylarkSet, variant: ThumbnailVariant }) => (
  <Rail displayCount header={set.title || set.title_short || undefined}>
    {(set.content?.objects as SetContent[])?.map(({object}) =>
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
)
