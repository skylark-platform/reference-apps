import { GraphQLBaseObject } from "../../interfaces";
import { ApiObjectType, MediaObjectTypes } from "../../types";

export const getExtId = (externalId: string) =>
  externalId.substring(externalId.indexOf("#") + 1);

export const getUidsFromField = (
  field: string[] | null,
  skylarkData: GraphQLBaseObject[]
) => {
  if (!field || field.length === 0) {
    return null;
  }

  const urls = skylarkData
    .filter(({ external_id }) => field.includes(getExtId(external_id)))
    .map(({ uid }) => uid);
  return urls;
};

export const gqlObjectMeta = (
  type: ApiObjectType | MediaObjectTypes
): {
  createFunc: string;
  updateFunc: string;
  objectType: MediaObjectTypes;
  argName: "brand" | "season" | "episode" | "movie" | "asset";
  relName: "brands" | "seasons" | "episodes" | "movies" | "assets";
} => {
  switch (type) {
    case "episodes":
    case "Episode":
      return {
        createFunc: "createEpisode",
        updateFunc: "updateEpisode",
        objectType: "Episode",
        argName: "episode",
        relName: "episodes",
      };
    case "seasons":
    case "Season":
      return {
        createFunc: "createSeason",
        updateFunc: "updateSeason",
        objectType: "Season",
        argName: "season",
        relName: "seasons",
      };
    case "movies":
    case "Movie":
      return {
        createFunc: "createMovie",
        updateFunc: "updateMovie",
        objectType: "Movie",
        argName: "movie",
        relName: "movies",
      };
    case "assets":
    case "Asset":
      return {
        createFunc: "createAsset",
        updateFunc: "updateAsset",
        objectType: "Asset",
        argName: "asset",
        relName: "assets",
      };
    default:
      return {
        createFunc: "createBrand",
        updateFunc: "updateBrand",
        objectType: "Brand",
        argName: "brand",
        relName: "brands",
      };
  }
};
