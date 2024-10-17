import { useQuery } from "@tanstack/react-query";

import { GQLError } from "../types";
import { LOCAL_STORAGE } from "../constants/app";
import { PlayerTokens } from "../components/generic/player";
import {
  SAAS_API_ENDPOINT,
  SAAS_API_KEY,
  SKYLARK_ADMIN_API_KEY,
} from "../constants/env";

interface ResponseBody {
  playback_url: string;
  playback_token?: string;
  storyboard_token?: string;
  thumbnail_token?: string;
}

const fetcher = (playbackId: string): Promise<ResponseBody> => {
  const body: BodyInit = JSON.stringify({
    playback_id: playbackId,
  });

  const localStorageUri = localStorage.getItem(LOCAL_STORAGE.uri);
  const localStorageApiKey = localStorage.getItem(LOCAL_STORAGE.apikey);

  const useLocalStorage = Boolean(localStorageUri && localStorageApiKey);

  const apiKeyFromEnv = SKYLARK_ADMIN_API_KEY || SAAS_API_KEY || "";

  const headers = {
    "X-Skylark-Api-Url":
      (useLocalStorage ? localStorageUri : SAAS_API_ENDPOINT) || "",
    "X-Skylark-Api-Key":
      (useLocalStorage ? localStorageApiKey : apiKeyFromEnv) || "",
    "Content-Type": "application/json",
  };

  return fetch("https://hook.skylarkplatform.com/playback-url/video/mux", {
    method: "POST",
    body,
    headers,
  }).then((res) => res.json()) as Promise<ResponseBody>;
};

const select = ({
  playback_url,
  storyboard_token,
  playback_token,
  thumbnail_token,
}: ResponseBody): PlayerTokens | undefined => {
  if (playback_token) {
    return {
      playback: playback_token,
      storyboard: storyboard_token,
      thumbnail: thumbnail_token,
    };
  }

  const url = new URL(playback_url);
  const token = url.searchParams.get("token");
  if (token) {
    return {
      playback: token,
    };
  }
  return undefined;
};

export const useMuxPlaybackTokens = (
  provider?: string,
  playbackId?: string,
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["MuxPlaybackToken", playbackId],
    queryFn: () => fetcher(playbackId || ""),
    enabled: Boolean(playbackId && provider?.toLocaleLowerCase() === "mux"),
    select,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    playbackTokens: data,
    isLoading,
    isError: error as GQLError,
  };
};
