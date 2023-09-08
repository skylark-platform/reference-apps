import { useQuery } from "@tanstack/react-query";
import {
  skylarkRequestWithDimensions,
  useDimensions,
} from "@skylark-reference-apps/react";
import { useEffect, useMemo } from "react";
import { GQLError, SkylarkImageListing } from "../types";
import { GET_STREAMTV_CONFIG } from "../graphql/queries/streamtvConfig";

interface StreamTVConfigResponse {
  listStreamtvConfig?: {
    objects?: {
      app_name: string;
      primary_color: string;
      accent_color: string;
      google_analytics_id: string;
      logo: SkylarkImageListing;
    }[];
  };
}

interface StreamTVConfig {
  appName: string;
  primaryColor: string;
  accentColor: string;
  gaCode: string;
  logo?: {
    alt: string;
    src: string;
  };
}

export const useStreamTVConfig = () => {
  const { dimensions } = useDimensions();

  const { data, error } = useQuery({
    queryKey: ["StreamTVConfig"],
    queryFn: () =>
      skylarkRequestWithDimensions<StreamTVConfigResponse>(
        GET_STREAMTV_CONFIG,
        dimensions,
        {}
      ),
    cacheTime: Infinity,
  });

  const config = useMemo((): StreamTVConfig | undefined => {
    if (
      !data?.listStreamtvConfig?.objects ||
      data.listStreamtvConfig.objects.length === 0
    ) {
      return undefined;
    }

    const gqlConfig = data.listStreamtvConfig.objects[0];

    const logo =
      gqlConfig.logo.objects &&
      gqlConfig.logo.objects.length > 0 &&
      gqlConfig.logo.objects[0];

    return {
      appName: gqlConfig.app_name,
      primaryColor: gqlConfig.primary_color,
      accentColor: gqlConfig.accent_color,
      gaCode: gqlConfig.google_analytics_id,
      logo:
        logo && logo.url
          ? {
              alt: logo.title || logo.url,
              src: logo.url,
            }
          : undefined,
    };
  }, [data]);

  useEffect(() => {
    if (config) {
      document.documentElement.style.setProperty(
        "--streamtv-primary-color",
        config.primaryColor
      );
      document.documentElement.style.setProperty(
        "--streamtv-accent-color",
        config.accentColor
      );
    }
  }, [config]);

  return {
    config,
    error: error as GQLError,
  };
};
