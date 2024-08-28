import {
  Dropdown,
  PlayerChapter,
  PlayerCuePoint,
} from "@skylark-reference-apps/react";
import { ReactNode, useState } from "react";
import { PlayerTimecodeEvent } from "./playerTimecodeEvent";
import { Maybe, TimecodeEventType, TimecodeEventWithType } from "../types";

interface PlayerPauseOverlayProps {
  timestamp: number;
  chapter: PlayerChapter<TimecodeEventWithType> | null;
}

const Section = ({ children }: { children: ReactNode }) => (
  <div className="h-5/6 w-full overflow-y-auto overflow-x-hidden px-2 lg:px-4">
    {children}
  </div>
);

const Tips = ({ tips }: { tips: PlayerCuePoint<TimecodeEventWithType>[] }) => {
  const firstTitle = tips.find(({ payload }) => Boolean(payload.title))?.payload
    .title as string;
  const [selected, setSelected] = useState(firstTitle);

  const options = tips
    .map(({ payload }) => payload.title as Maybe<string>)
    .filter((title): title is string =>
      Boolean(title && typeof title === "string"),
    );

  const tip = selected && tips.find((t) => t.payload.title === selected);

  return (
    <Section>
      {tips && (
        <p className="mb-6 ml-4 w-full text-lg font-medium text-white">{`Tips`}</p>
      )}
      {options?.length > 1 && (
        <div className="px-4">
          <Dropdown
            items={options}
            label={options[0]}
            onChange={(u) => setSelected(u || firstTitle)}
          />
        </div>
      )}
      {tip && (
        <div className="my-8 overflow-x-auto" key={tip.uid}>
          <PlayerTimecodeEvent payload={tip.payload} />
        </div>
      )}
    </Section>
  );
};

const Adverts = ({
  adverts,
}: {
  adverts: PlayerCuePoint<TimecodeEventWithType>[];
}) => (
  <Section>
    <p className="mb-6 ml-4 w-full text-lg font-medium text-white">
      {`In this scene`}
    </p>
    {adverts?.map((ad) => (
      <div className="my-8" key={ad.uid}>
        <PlayerTimecodeEvent payload={ad?.payload} />
      </div>
    ))}
  </Section>
);

export const PlayerPauseOverlay = ({ chapter }: PlayerPauseOverlayProps) => {
  if (!chapter) {
    return <></>;
  }

  const tips = chapter?.cuePoints?.filter(
    (cp) => cp.payload.type === TimecodeEventType.Tips,
  );

  const adverts = chapter?.cuePoints?.filter(
    (cp) => cp.payload.type?.startsWith("AD"),
  );

  console.log({ chapter });

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black bg-opacity-75 p-8"
      key={chapter.uid}
    >
      <p className="w-full px-8 pt-8 text-left text-xl font-medium text-white">
        {chapter?.title || ""}
      </p>
      <div className="mb-4 grid h-full max-h-full w-full grid-cols-2 items-center justify-center overflow-hidden">
        {tips && tips.length > 0 && <Tips tips={tips} />}
        {adverts && adverts.length > 0 && <Adverts adverts={adverts} />}
      </div>
    </div>
  );
};
