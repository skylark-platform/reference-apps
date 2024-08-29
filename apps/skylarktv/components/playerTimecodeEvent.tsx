import { Button, ParseAndDisplayHTML } from "@skylark-reference-apps/react";
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

  return (
    <div className="mx-2 h-32 flex-grow rounded-sm text-white shadow-lg">
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
          <Whisk recipeUrl={payload.link_href as string} uid={payload.uid} />
        </>
      )}
      {payload.type === TimecodeEventType.Advertlink && payload.link_href && (
        <>
          <a
            className="flex h-full flex-row items-center opacity-90 hover:opacity-100"
            href={payload.link_href as string}
            rel="noreferrer"
            target="_blank"
          >
            {image && image.url && (
              // <div
              //   className="block h-full w-32 flex-grow"
              //   style={{ backgroundImage: `url(${image.url})` }}
              // >
              //   </div>
              // {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={image.alt_text || `alt for ${image.url}`}
                className="mr-6 block h-full object-contain"
                src={image.url}
              />
            )}
            {/* <p className="text-sm md:text-base">{payload.link_text}</p> */}
            <div className="flex flex-col space-y-3">
              <ParseAndDisplayHTML
                className="-mt-2"
                fallbackMessage=""
                html={payload.copy || null}
                variant="tight"
              />
              <Button text={payload.link_text as string} variant="secondary" />
            </div>
          </a>
        </>
      )}
    </div>
  );
};
