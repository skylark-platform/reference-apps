import React from "react";
import MuxVideo from "@mux-elements/mux-video-react";

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
    <MuxVideo
      className="aspect-video w-screen bg-black shadow shadow-black sm:w-11/12 md:w-3/4 md:shadow-xl lg:w-2/3 xl:w-1/2"
      controls
      data-testid="player"
      metadata={{
        video_id: videoId,
        video_title: videoTitle,
      }}
      poster={poster}
      ref={undefined}
      // Convert relative URL into absolute
      src={absoluteSrc}
      streamType={"on-demand"}
    />
  );
};

export default Player;
