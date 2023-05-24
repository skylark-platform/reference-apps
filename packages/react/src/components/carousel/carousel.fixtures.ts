import { CarouselItem } from "./carousel.component";

export const heros: CarouselItem[] = [
  {
    title: "Deadpool",
    href: "deadpool",
    image: "/heros/deadpool.png",
    duration: "1hr 25m",
    releaseDate: "2018",
    type: "movie",
    callToAction: {
      text: "Watch for free",
      description: "30 day free trial available. £12.99/mo after.",
      type: "LINK_TO_RELATED_OBJECT",
    },
  },
  {
    title: "Game of Thrones",
    href: "got",
    image: "/heros/got.png",
    releaseDate: "2011",
    type: "season",
    callToAction: {
      text: "Watch for free",
      description: "30 day free trial available. £12.99/mo after.",
      type: "LINK_TO_RELATED_OBJECT",
    },
  },
  {
    title: "Sing 2",
    href: "sing-2",
    image: "/heros/sing.png",
    duration: "1hr 25m",
    releaseDate: "2022",
    type: "movie",
    callToAction: {
      text: "Watch for free",
      description: "30 day free trial available. £12.99/mo after.",
      type: "LINK_TO_RELATED_OBJECT",
    },
  },
  {
    title: "Us",
    href: "us",
    image: "/heros/us.png",
    duration: "1hr 25m",
    releaseDate: "2019",
    type: "movie",
    callToAction: {
      text: "Watch for free",
      description: "30 day free trial available. £12.99/mo after.",
      type: "LINK_TO_RELATED_OBJECT",
    },
  },
];
