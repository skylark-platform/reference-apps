import { useQuery } from "@tanstack/react-query";

import {
  LOCAL_STORAGE,
  SAAS_API_ENDPOINT,
  SAAS_API_KEY,
} from "@skylark-reference-apps/lib";
import { GQLError } from "../types";

interface ResponseBody {
  playback_url: string;
}

const fetcher = (playbackId: string): Promise<ResponseBody> => {
  const body: BodyInit = JSON.stringify({
    playback_id: playbackId,
  });

  const localStorageUri = localStorage.getItem(LOCAL_STORAGE.uri);
  const localStorageApiKey = localStorage.getItem(LOCAL_STORAGE.apikey);

  const useLocalStorage = Boolean(localStorageUri && localStorageApiKey);

  const headers = {
    "X-Skylark-Api-Url":
      (useLocalStorage ? localStorageUri : SAAS_API_ENDPOINT) || "",
    "X-Skylark-Api-Key":
      (useLocalStorage ? localStorageApiKey : SAAS_API_KEY) || "",
    "Content-Type": "application/json",
  };

  return fetch("https://hook.skylarkplatform.com/playback-url/video/mux", {
    method: "POST",
    body,
    headers,
  }).then((res) => res.json()) as Promise<ResponseBody>;
};

const select = ({ playback_url }: ResponseBody): string | undefined => {
  const url = new URL(playback_url);
  const token = url.searchParams.get("token");
  return token || undefined;
};

export const useMuxPlaybackToken = (provider?: string, playbackId?: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["MuxPlaybackToken", playbackId],
    queryFn: () => fetcher(playbackId || ""),
    enabled: Boolean(playbackId && provider?.toLocaleLowerCase() === "mux"),
    select,
  });

  return {
    token: data,
    isLoading,
    isError: error as GQLError,
  };
};
