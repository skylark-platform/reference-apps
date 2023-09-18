import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { skylarkRequestWithLocalStorage } from "@skylark-reference-apps/react";
import { GQLError, StreamTVAdditionalFields } from "../types";
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
  hasStreamTVConfig: boolean;
  objectTypes: string[];
}

export const useSkylarkEnvironment = () => {
  const { data, error } = useQuery({
    queryKey: ["SkylarkEnvironment"],
    queryFn: () =>
      skylarkRequestWithLocalStorage<SkylarkEnvironmentResponse>(
        GET_SKYLARK_ENVIRONMENT,
        {},
        {},
      ),
  });

  const environment: SkylarkEnvironment = useMemo(() => {
    const hasUpdatedSeason = Boolean(
      data?.seasonFields?.fields &&
        data.seasonFields.fields.findIndex(
          ({ name }) => name === StreamTVAdditionalFields.PreferredImageType,
        ) > -1,
    );

    const objectTypes =
      data?.objectTypes?.possibleTypes.map(({ name }) => name) || [];

    const hasStreamTVConfig = objectTypes.includes("StreamtvConfig");

    return {
      hasUpdatedSeason,
      hasStreamTVConfig,
      objectTypes,
    };
  }, [data]);

  return {
    environment,
    error: error as GQLError,
  };
};
