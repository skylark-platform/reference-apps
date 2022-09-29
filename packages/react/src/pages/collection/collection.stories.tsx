import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  CollectionPage,
  CollectionPageParsedContentItem,
} from "./collection.page";

export default {
  title: "Pages/CollectionPage",
  component: CollectionPage,
} as ComponentMeta<typeof CollectionPage>;

const Template: ComponentStory<typeof CollectionPage> = (args) => (
  <CollectionPage {...args} />
);

const CollectionItemDataFetcher: React.FC<{
  slug: string;
  self: string;
  children(data: CollectionPageParsedContentItem): React.ReactNode;
}> = ({ children, slug, self }) => {
  // Using the self to get the episode number into the data fetcher
  const data: CollectionPageParsedContentItem = {
    uid: `content-item-${self}`,
    slug,
    title: `Movie ${self}`,
    synopsis: "Not quite Pulp Fiction...",
    image: `/movies/Movie ${self}.png`,
    href: `/episodes/${self}`,
  };

  return <>{children(data)}</>;
};

export const Default = Template.bind({});
Default.args = {
  CollectionItemDataFetcher,
  bgImage: "/heros/tarantino-collection.jpeg",
  rating: "18+",
  releaseDate: "1996-04-30",
  synopsis:
    'Ever since Quentin Tarantino broke into the movie scene with Reservoir Dogs in 1992, the term "Tarantinoesque," both compliment and pejorative, has firmly entrenched itself in the pop culture lexicon. It describes an ego-driven mode of filmmaking, featuring hyper-stylized violence, tough and gamey yet melodious dialogue, disparate storylines that come together in some way (usually via lightly avant-garde editing), and crash zooms.',
  title: "The Tarantino Collection",
  content: Array.from({ length: 10 }, (__, index) => ({
    self: `${index + 1}`,
    slug: `item-${index + 1}`,
  })),
};
