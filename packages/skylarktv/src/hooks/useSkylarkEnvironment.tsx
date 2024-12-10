import { useQuery } from "@tanstack/react-query";
import { GQLError, SkylarkTVAdditionalFields } from "../types";
import { GET_SKYLARK_ENVIRONMENT } from "../graphql/queries/skylarkEnvironment";
import { skylarkRequestWithLocalStorage } from "../lib/utils";

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

const select = (data: SkylarkEnvironmentResponse): SkylarkEnvironment => {
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
};

export const useSkylarkEnvironment = () => {
  const { data, error, isLoading } = useQuery<
    SkylarkEnvironmentResponse,
    GQLError,
    SkylarkEnvironment
  >({
    queryKey: ["SkylarkEnvironment"],
    queryFn: () =>
      skylarkRequestWithLocalStorage<SkylarkEnvironmentResponse>(
        GET_SKYLARK_ENVIRONMENT,
        {},
        {},
      ),
    refetchOnMount: false,
    select,
  });

  return {
    environment: data,
    isLoading,
    error,
  };
};
