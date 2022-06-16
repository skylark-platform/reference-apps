import {
  ApiPlaybackResponse,
  ExpandedSkylarkObjects,
  UnexpandedSkylarkObjects,
} from "@skylark-reference-apps/lib";
import axios from "axios";
import useSWR from "swr";

const assetUrlFetcher = (uid: string) =>
  axios
    .get<ApiPlaybackResponse>(`/api/playback/${uid}`)
    .then((res) => res.data.playback_url);

export const useAssetPlaybackUrl = (
  items: ExpandedSkylarkObjects | UnexpandedSkylarkObjects | undefined
) => {
  const { data: playbackUrl, error } = useSWR<string, Error>(
    items?.objects[0].uid,
    assetUrlFetcher
  );

  return {
    playbackUrl,
    isError: error,
    isLoading: !error && !playbackUrl,
  };
};
