export type EntertainmentType = "movie" | "episode" | "season" | "brand";

interface EntertainmentInformation {
  uid: string;
  objectTitle: string;
  slug: string;
  type: EntertainmentType;
  releaseDate?: string;
  title?: {
    short?: string;
    medium?: string;
    long?: string;
  };
  synopsis?: {
    short?: string;
    medium?: string;
    long?: string;
  };
  tags?: string[];
  titleSort?: string;
  creditUrls?: string[];
  ratingUrls?: string[];
  genreUrls?: string[];
  // imageUrls?: string[];
  themeUrls?: string[];
  images?: {
    type: string;
    url: string;
    urlPath: string;
  }[];

  // Include image property during development, in future use imageUrls
  image?: string;
}

export interface Movie extends EntertainmentInformation {
  type: "movie";
  duration?: string;
}

export interface Episode extends EntertainmentInformation {
  type: "episode";
  number?: number;
  duration?: string;
}

export interface Season extends EntertainmentInformation {
  type: "season";
  numberOfEpisodes?: number;
  number?: number;
  items?: Episode[];
}

export interface Brand extends EntertainmentInformation {
  type: "brand";
  items?: (Movie | Episode | Season)[];
}

export const entertainmentTypeAsString = (type: EntertainmentType) => {
  switch (type) {
    case "movie":
      return "Movie";
    case "episode":
      return "Episode";
    case "season":
      return "Season";
    case "brand":
      return "Brand";
    default:
      throw new Error("Unknown EntertainmentType");
  }
};
