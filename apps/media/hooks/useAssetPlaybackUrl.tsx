import {
  ApiPlaybackResponse,
  ExpandedSkylarkObjects,
  UnexpandedSkylarkObjects,
} from "@skylark-reference-apps/lib";
import axios from "axios";
import { useEffect, useState } from "react";

export const useAssetPlaybackUrl = (
  items: ExpandedSkylarkObjects | UnexpandedSkylarkObjects | undefined
) => {
  const [playbackUrl, setPlaybackUrl] = useState("");

  useEffect(() => {
    if (items?.isExpanded && items.objects[0].uid) {
      axios
        .get<ApiPlaybackResponse>(`/api/playback/${items.objects[0].uid}`)
        .then((res) => setPlaybackUrl(res.data.playback_url))
        .catch((error) => {
          console.error(error);
          setPlaybackUrl("");
        });
    }
  }, [items]);
  return playbackUrl;
};
