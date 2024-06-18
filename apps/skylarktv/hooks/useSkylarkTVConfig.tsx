import { useQuery } from "@tanstack/react-query";
import {
  skylarkRequestWithDimensions,
  useDimensions,
} from "@skylark-reference-apps/react";
import { useEffect, useMemo } from "react";
import { GQLError, SkylarkImageListing } from "../types";
import {
  GET_APP_CONFIG,
  GET_STREAMTV_CONFIG,
} from "../graphql/queries/skylarktvConfig";
import {
  addGoogleTagManagerNoScriptToBody,
  removeGoogleTagManagerNoScriptFromBody,
} from "../components/googleTagManager";
import { useSkylarkEnvironment } from "./useSkylarkEnvironment";

interface SkylarkTVConfigResponse {
  listSkylarktvConfig?: {
    objects?: {
      app_name: string;
      primary_color: string;
      accent_color: string;
      google_tag_manager_id: string;
      featured_page_url: string;
      logo: SkylarkImageListing;
    }[];
  };
}

interface SkylarkTVConfig {
  appName: string;
  primaryColor: string;
  accentColor: string;
  googleTagManagerId: string;
  featuredPageUrl: string;
  logo?: {
    alt: string;
    src: string;
  };
}

export const useSkylarkTVConfig = () => {
  const { dimensions } = useDimensions();

  const { environment } = useSkylarkEnvironment();

  const { data, error } = useQuery({
    queryKey: ["SkylarkTVConfig", dimensions],
    queryFn: () =>
      skylarkRequestWithDimensions<SkylarkTVConfigResponse>(
        environment.hasAppConfig ? GET_APP_CONFIG : GET_STREAMTV_CONFIG,
        dimensions,
        {},
      ),
    cacheTime: Infinity,
    enabled: environment.hasAppConfig || environment.hasStreamTVConfig,
  });

  const config = useMemo((): SkylarkTVConfig | undefined => {
    if (
      !data?.listSkylarktvConfig?.objects ||
      data.listSkylarktvConfig.objects.length === 0
    ) {
      return undefined;
    }

    const gqlConfig = data.listSkylarktvConfig.objects[0];

    const logo =
      gqlConfig.logo.objects &&
      gqlConfig.logo.objects.length > 0 &&
      gqlConfig.logo.objects[0];

    return {
      appName: gqlConfig.app_name,
      primaryColor: gqlConfig.primary_color,
      accentColor: gqlConfig.accent_color,
      googleTagManagerId: gqlConfig.google_tag_manager_id,
      featuredPageUrl: gqlConfig.featured_page_url,
      logo:
        logo && logo.url
          ? {
              alt: logo.title || logo.slug || logo.url,
              src: logo.url,
            }
          : undefined,
    };
  }, [data]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--skylarktv-primary-color",
      config?.primaryColor || "#5b45ce",
    );
    document.documentElement.style.setProperty(
      "--skylarktv-accent-color",
      config?.accentColor || "#ff385c",
    );

    if (config?.googleTagManagerId) {
      addGoogleTagManagerNoScriptToBody(config?.googleTagManagerId);
    } else {
      removeGoogleTagManagerNoScriptFromBody();
    }
  }, [config]);

  return {
    config,
    error: error as GQLError,
  };
};
