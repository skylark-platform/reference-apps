import {
  MovieThumbnailProps,
  EpisodeThumbnailProps,
  ThumbnailProps,
  CarouselItem,
} from "@skylark-reference-apps/react";

export const heros: CarouselItem[] = [
  {
    uid: "1",
    title: "Deadpool",
    slug: "deadpool",
    image: "/heros/deadpool.png",
    duration: "1hr 25m",
    releaseDate: "2018",
    type: "movie",
  },
  {
    uid: "2",
    title: "Game of Thrones",
    slug: "got",
    image: "/heros/got.png",
    releaseDate: "2011",
    type: "season",
  },
  {
    uid: "3",
    title: "Sing 2",
    slug: "sing-2",
    image: "/heros/sing.png",
    duration: "1hr 25m",
    releaseDate: "2022",
    type: "movie",
  },
  {
    uid: "4",
    title: "Us",
    slug: "us",
    image: "/heros/us.png",
    duration: "1hr 25m",
    releaseDate: "2019",
    type: "movie",
  },
];

export const movieThumbnails: MovieThumbnailProps[] = [
  {
    href: "/",
    title: "Tenet",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%201.png",
  },
  {
    href: "/",
    title: "Emma",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%202.png",
  },
  {
    href: "/",
    title: "Cruella",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%203.png",
  },
  {
    href: "/",
    title: "Mank",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%204.png",
  },
  {
    href: "/",
    title: "Anna",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%205.png",
  },
  {
    href: "/",
    title: "1917",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%206.png",
  },
  {
    href: "/",
    title: "The Kid Who Would Be King",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%207.png",
  },
  {
    href: "/",
    title: "6 Underground",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%208.png",
  },
  {
    href: "/",
    title: "Once Upon a Time in Hollywood",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%209.png",
  },
  {
    href: "/",
    title: "Escape from Pretoria",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%2010.png",
  },
  {
    href: "/",
    title: "The Hustle",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%2011.png",
  },
  {
    href: "/",
    title: "Ava",
    subtitle: "Talent",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%2012.png",
  },
];

export const allMovieBackgroundImages = movieThumbnails.map(
  ({ backgroundImage }) => backgroundImage
);

export const episodeThumbnails: EpisodeThumbnailProps[] = [
  {
    href: "/",
    title: "Winter is Coming",
    number: 1,
    description:
      "Series Premiere. Eddard Stark is torn between his family and an old friend when asked to serve at the side of King Robert Baratheon; Viserys plans to wed his sister to a nomadic warlord in exchange for an army.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%201.png",
    duration: "55m",
  },
  {
    href: "/",
    title: "The Kingsroad",
    number: 2,
    description:
      "While Bran recovers from his fall, Ned takes only his daughters to King's Landing. Jon Snow goes with his uncle Benjen to the Wall. Tyrion joins them.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%202.png",
    duration: "52m",
  },
  {
    href: "/",
    title: "Lord Snow",
    number: 3,
    description:
      "Jon begins his training with the Night's Watch; Ned confronts his past and future at King's Landing; Daenerys finds herself at odds with Viserys.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%203.png",
    duration: "59m",
  },
  {
    href: "/",
    title: "Cripples, Bastards, and Broken Things",
    number: 4,
    description:
      "Eddard investigates Jon Arryn's murder. Jon befriends Samwell Tarly, a coward who has come to join the Night's Watch.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%204.png",
    duration: "55m",
  },
  {
    href: "/",
    title: "The Wolf and the Lion",
    number: 5,
    description:
      "Catelyn has captured Tyrion and plans to bring him to her sister, Lysa Arryn, at the Vale, to be tried for his, supposed, crimes against Bran. Robert plans to have Daenerys killed, but Eddard refuses to be a part of it and quits.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%205.png",
    duration: "53m",
  },
  {
    href: "/",
    title: "A Golden Crown",
    number: 6,
    description:
      "While recovering from his battle with Jaime, Eddard is forced to run the kingdom while Robert goes hunting. Tyrion demands a trial by combat for his freedom. Viserys is losing his patience with Drogo.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%206.png",
    duration: "53m",
  },
  {
    href: "/",
    title: "You Win or You Die",
    number: 7,
    description:
      "Robert has been injured while hunting and is dying. Jon and the others finally take their vows to the Night's Watch. A man, sent by Robert, is captured for trying to poison Daenerys. Furious, Drogo vows to attack the Seven Kingdoms.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%207.png",
    duration: "49m",
  },
  {
    href: "/",
    title: "The Pointy End",
    number: 8,
    description:
      "The Lannisters press their advantage over the Starks; Robb rallies his father's northern allies and heads south to war; The White Walkers attack the Wall; Tyrion returns to his father with some new friends.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%208.png",
    duration: "57m",
  },
  {
    href: "/",
    title: "Baelor",
    number: 9,
    description:
      "Robb goes to war against the Lannisters. Jon finds himself struggling on deciding if his place is with Robb or the Night's Watch. Drogo has fallen ill from a fresh battle wound. Daenerys is desperate to save him.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%209.png",
    duration: "56m",
  },
  {
    href: "/",
    title: "Fire and Blood",
    number: 10,
    description:
      "Robb vows to get revenge on the Lannisters. Jon must officially decide if his place is with Robb or the Night's Watch. Daenerys says her final goodbye to Drogo.",
    backgroundImage: "/episodes/GOT%20-%20S1%20-%2010.png",
    duration: "59m",
  },
];

export const collectionThumbnails: ThumbnailProps[] = [
  {
    href: "/",
    title: "Sherlock Holmes",
    backgroundImage: "/collections/Brand%20-%20Sherlock.png",
    tags: ["Genres", "Themes"],
  },
  {
    href: "/",
    title: "Football Documentaries",
    backgroundImage: "/collections/Brand%20-%20Football.png",
    tags: ["Sport", "Documentaries"],
  },
  {
    href: "/",
    title: "Drama",
    backgroundImage: "/collections/Brand%20-%20Drama.png",
    tags: ["Genres", "Themes"],
  },
  {
    href: "/",
    title: "Tarantino",
    backgroundImage: "/collections/Brand%20-%20Tarantino.png",
    tags: ["Genres", "Themes"],
  },
  {
    href: "/",
    title: "Game of Thrones",
    backgroundImage: "/collections/Brand%20-%20Game%20of%20Thrones.png",
    tags: ["Genres", "Themes"],
  },
];
