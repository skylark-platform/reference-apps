import React from "react";
import MuxVideo from "@mux/mux-video-react";
import { addCloudinaryOnTheFlyImageTransformation } from "@skylark-reference-apps/lib";

interface PlayerProps {
  src: string;
  poster?: string;
  videoId: string;
  videoTitle: string;
}

export const Player: React.FC<PlayerProps> = ({
  src,
  poster,
  videoId,
  videoTitle,
}) => {
  const isClient = typeof window !== "undefined";
  const absoluteSrc =
    isClient && src
      ? new URL(
          src,
          `${window.location.protocol}//${window.location.host}`
        ).toString()
      : undefined;

  return (
    <div className="w-screen sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
      <div className="aspect-h-9 aspect-w-16 shadow shadow-black md:shadow-xl">
        {/* For Google Drive videos, use iframe embed because they don't work with MuxPlayer */}
        {src.startsWith("https://drive.google.com/file") &&
        src.endsWith("/preview") ? (
          <iframe src={src} />
        ) : (
          <MuxVideo
            className="h-full w-full bg-black object-cover object-center"
            controls
            data-testid="player"
            metadata={{
              video_id: videoId,
              video_title: videoTitle,
            }}
            poster={
              poster
                ? addCloudinaryOnTheFlyImageTransformation(poster, {
                    width: 1000,
                  })
                : undefined
            }
            ref={undefined}
            // Convert relative URL into absolute
            src={absoluteSrc}
            streamType={"on-demand"}
          />
        )}
      </div>
    </div>
  );
};

export default Player;
