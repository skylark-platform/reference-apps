import { addCloudinaryOnTheFlyImageTransformation } from "@skylark-reference-apps/lib";
import React from "react";
import MuxVideo from "@mux/mux-video-react";

import dynamic from "next/dynamic";

export interface PlayerCuePoint {
  title?: string;
  startTime: number;
  endTime?: number;
  payload: object;
}

export interface PlayerChapter {
  title?: string;
  startTime: number;
  endTime?: number;
  cuePoints?: PlayerCuePoint[];
}

interface PlayerProps {
  src: string;
  srcId?: string;
  poster?: string;
  videoId: string;
  videoTitle: string;
  autoPlay?: boolean;
  provider?: string;
  chapters?: PlayerChapter[];
  cuePoints?: PlayerCuePoint[];
}

const getPlayerType = (src: string, provider?: string, srcId?: string) => {
  if (
    src.startsWith("https://drive.google.com/file") &&
    src.endsWith("/preview")
  ) {
    return "iframe";
  }

  if (src.includes("youtube")) {
    return "react-player";
  }

  if (provider && srcId && provider.toLocaleLowerCase() === "mux") {
    return "mux-player";
  }

  return "mux-video";
};

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
});

const ThumbnailImage = ({ src }: { src?: string }) =>
  src ? (
    <img
      alt="Thumbnail"
      className="h-full w-full bg-black object-cover object-center"
      src={src}
    />
  ) : undefined;

export const Player: React.FC<PlayerProps> = ({
  src,
  srcId,
  poster,
  autoPlay,
  videoId,
  videoTitle,
  provider,
}) => {
  const isClient = typeof window !== "undefined";
  const absoluteSrc =
    isClient && src
      ? new URL(
          src,
          `${window.location.protocol}//${window.location.host}`,
        ).toString()
      : undefined;

  const type = getPlayerType(src, provider, srcId);

  const posterSrc = poster
    ? addCloudinaryOnTheFlyImageTransformation(poster, {
        width: 1000,
      })
    : undefined;

  return (
    <div className="w-screen sm:w-11/12 lg:w-3/4">
      <div className="aspect-h-9 aspect-w-16 relative shadow shadow-black md:shadow-xl">
        {/* For Google Drive videos, use iframe embed because they don't work with MuxPlayer */}
        {type === "iframe" && <iframe src={src} />}
        {type === "react-player" && (
          <ReactPlayer
            config={{}}
            controls={true}
            height="100%"
            light={<ThumbnailImage src={posterSrc} />}
            playing={autoPlay}
            style={{ height: "100%", width: "100%" }}
            url={absoluteSrc}
            width="100%"
          />
        )}
        {type === "mux-player" && (
          <MuxPlayer
            autoPlay={autoPlay}
            className="h-full w-full bg-black object-cover object-center"
            data-testid="player"
            metadata={{
              video_id: videoId,
              video_title: videoTitle,
            }}
            playbackId={srcId || src}
            poster={posterSrc}
            ref={undefined}
            streamType={"on-demand"}
          />
        )}
        {type === "mux-video" && (
          <MuxVideo
            autoPlay={autoPlay}
            className="h-full w-full bg-black object-cover object-center"
            controls
            data-testid="player"
            metadata={{
              video_id: videoId,
              video_title: videoTitle,
            }}
            poster={posterSrc}
            ref={undefined}
            src={absoluteSrc} // Convert relative URL into absolute
            streamType={"on-demand"}
          />
        )}
      </div>
    </div>
  );
};
