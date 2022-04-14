import { ThumbnailProps } from "../thumbnail";

export const thumbnails: ThumbnailProps[] = [
  {
    id: "1",
    href: "/",
    title: "Tenet",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%201.png",
  },
  {
    id: "2",
    href: "/",
    title: "Emma",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%202.png",
  },
  {
    id: "3",
    href: "/",
    title: "Cruella",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%203.png",
  },
  {
    id: "4",
    href: "/",
    title: "Mank",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%204.png",
  },
  {
    id: "5",
    href: "/",
    title: "Anna",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%205.png",
  },
  {
    id: "6",
    href: "/",
    title: "1917",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%206.png",
  },
  {
    id: "7",
    href: "/",
    title: "The Kid Who Would Be King",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%207.png",
  },
  {
    id: "8",
    href: "/",
    title: "6 Underground",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%208.png",
  },
  {
    id: "9",
    href: "/",
    title: "Once Upon a Time in Hollywood",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%209.png",
  },
  {
    id: "10",
    href: "/",
    title: "Escape from Pretoria",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%2010.png",
  },
  {
    id: "11",
    href: "/",
    title: "The Hustle",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%2011.png",
  },
  {
    id: "12",
    href: "/",
    title: "Ava",
    subtitle: "by Talent Name",
    tags: ["Action", "Comedy"],
    backgroundImage: "/movies/Movie%2012.png",
  },
];

export const allBackgroundImages = thumbnails.map(
  ({ backgroundImage }) => backgroundImage
);
