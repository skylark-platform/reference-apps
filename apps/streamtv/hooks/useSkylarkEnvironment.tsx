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
}

interface SkylarkEnvironment {
  hasUpdatedSeason: boolean;
}

export const useSkylarkEnvironment = () => {
  const { data, error, ...rest } = useQuery({
    queryKey: ["SkylarkEnvironment"],
    queryFn: () =>
      skylarkRequestWithLocalStorage<SkylarkEnvironmentResponse>(
        GET_SKYLARK_ENVIRONMENT,
        {},
        {}
      ),
  });

  const environment: SkylarkEnvironment = useMemo(() => {
    const hasUpdatedSeason = Boolean(
      data?.seasonFields?.fields &&
        data.seasonFields.fields.findIndex(
          ({ name }) => name === StreamTVAdditionalFields.PreferredImageType
        ) > -1
    );

    return {
      hasUpdatedSeason,
    };
  }, [data]);

  return {
    environment,
    ...rest,
    error: error as GQLError,
  };
};
