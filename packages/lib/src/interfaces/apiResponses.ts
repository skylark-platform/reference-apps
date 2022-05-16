interface BaseApiEntertainment {
  title: string;
  title_short?: string;
  title_medium?: string;
  title_long?: string;
  synopsis_short?: string;
  synopsis_medium?: string;
  synopsis_long?: string;
  image_urls?: ApiImage[];
}

interface ApiImage {
  url: string;
  url_path: string;
  image_type: string;
}

interface ApiEpisode extends BaseApiEntertainment {
  episode_number?: number;
}

interface ApiSeasonWithEpisode extends BaseApiEntertainment {
  items: ApiEpisode[];
  year?: number;
  season_number: number;
}

interface ApiBrandWithSeasonsAndEpisodes extends BaseApiEntertainment {
  title: string;
  items: ApiSeasonWithEpisode[];
}

export interface ApiResponseBrandWithSeasonsAndEpisodes {
  objects: ApiBrandWithSeasonsAndEpisodes[];
}
