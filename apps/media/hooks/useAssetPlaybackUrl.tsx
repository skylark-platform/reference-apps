import { ApiPlaybackResponse } from "@skylark-reference-apps/lib";
import axios from "axios";
import useSWR from "swr";

const assetUrlFetcher = (uid: string) =>
  axios
    .get<ApiPlaybackResponse>(`/api/playback/${uid}`)
    .then((res) => res.data);

export const useAssetPlaybackUrl = (uid?: string) => {
  const { data, error } = useSWR<ApiPlaybackResponse, Error>(
    uid,
    assetUrlFetcher
  );

  return {
    playbackUrl: data?.playback_url,
    isError: error,
    isLoading: !error && !data,
  };
};
