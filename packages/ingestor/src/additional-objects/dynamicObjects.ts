/**
 * Specs for dynamic objects that are created by the ingestor outside of Airtable
 * (Usually you'd create these through the CMS)
 */
import { DynamicObjectConfig } from "../interfaces";

export const quentinTarantinoMovies: DynamicObjectConfig = {
  name: "quentin-tarantino-movies",
  resource: "movies",
  query: "(people:%22Quentin Tarantino%22)",
};
