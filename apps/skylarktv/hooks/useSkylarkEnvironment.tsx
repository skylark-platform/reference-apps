import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { skylarkRequestWithLocalStorage } from "@skylark-reference-apps/react";
import { GQLError, SkylarkTVAdditionalFields } from "../types";
import { GET_SKYLARK_ENVIRONMENT } from "../graphql/queries/skylarkEnvironment";

interface SkylarkEnvironmentResponse {
  seasonFields?: {
    fields: {
      name: string;
      type: {
        name: string;
        kind: string;
      };
    }[];
  };
  objectTypes?: {
    possibleTypes: {
      name: string;
    }[];
  };
}

interface SkylarkEnvironment {
  hasUpdatedSeason: boolean;
  hasAppConfig: boolean;
  hasStreamTVConfig: boolean;
  objectTypes: string[];
}

export const useSkylarkEnvironment = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["SkylarkEnvironment"],
    queryFn: () =>
      skylarkRequestWithLocalStorage<SkylarkEnvironmentResponse>(
        GET_SKYLARK_ENVIRONMENT,
        {},
        {},
      ),
    refetchOnMount: false,
  });

  const environment: SkylarkEnvironment = useMemo(() => {
    const hasUpdatedSeason = Boolean(
      data?.seasonFields?.fields &&
        data.seasonFields.fields.findIndex(
          ({ name }) =>
            (name as SkylarkTVAdditionalFields) ===
            SkylarkTVAdditionalFields.PreferredImageType,
        ) > -1,
    );

    const objectTypes =
      data?.objectTypes?.possibleTypes.map(({ name }) => name) || [];

    const hasStreamTVConfig = objectTypes.includes("StreamtvConfig");
    const hasAppConfig = objectTypes.includes("AppConfig");

    return {
      hasUpdatedSeason,
      hasStreamTVConfig,
      hasAppConfig,
      objectTypes,
    };
  }, [data]);

  return {
    environment,
    isLoading,
    error: error as GQLError,
  };
};
