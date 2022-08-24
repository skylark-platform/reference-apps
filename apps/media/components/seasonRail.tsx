import { FC } from "react";

import {
  AllEntertainment,
  TitleTypes,
  SynopsisTypes,
} from "@skylark-reference-apps/lib";

interface SeasonRailProps {
  episodeDescription: SynopsisTypes[];
  episodeTitle: TitleTypes[];
  item: AllEntertainment;
  header?: string;
  thumbnailSize?: string;
}

export const SeasonRail: FC<SeasonRailProps> = (props) => {
  console.log("Episode", props);
  return <div>{"test"}</div>;
};
