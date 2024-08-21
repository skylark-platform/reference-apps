import { ParseAndDisplayHTML } from "@skylark-reference-apps/react";
import { Whisk } from "./shoppable/whisk";
import { TimecodeEventType, TimecodeEventWithType } from "../types";

interface PlayerTimecodeEventProps {
  payload?: TimecodeEventWithType;
}

export const PlayerTimecodeEvent = ({ payload }: PlayerTimecodeEventProps) => {
  if (!payload) {
    return <></>;
  }

  const image = payload.images?.objects?.[0];
  console.log({ image });

  return (
    <div className="px-4 text-white">
      {/* {type} */}
      {/* {cuePoints?.find(({ payload: { type }}) => type && type === "WHISK")?.payload.link_href}
              <Whisk whiskId="ce7ce5b6e-f194-4f6b-8ed8-be5a05db90ef" /> */}
      {payload.type === TimecodeEventType.Tips && (
        <>
          <ParseAndDisplayHTML fallbackMessage="" html={payload.copy || null} />
        </>
      )}
      {payload.type === TimecodeEventType.Whisk && (
        <>
          <p>{`Whisk will be here`}</p>
          <Whisk whiskId={payload.link_href as string} />
        </>
      )}
      {payload.type === TimecodeEventType.Advertlink && payload.link_href && (
        <>
          <a
            className="my-4 flex flex-row items-center opacity-90 hover:opacity-100"
            href={payload.link_href as string}
            rel="noreferrer"
            target="_blank"
          >
            {image && image.url && (
              <img
                className="mr-4 max-h-32 w-10 rounded-sm object-cover md:w-12 lg:w-16 xl:w-20 2xl:w-24"
                src={image.url}
              />
            )}
            <p className="text-sm md:text-base md:text-lg">
              {payload.link_text}
            </p>
          </a>
        </>
      )}
    </div>
  );
};
