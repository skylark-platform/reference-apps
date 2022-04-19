import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Rail } from "./rail.component";
import {
  episodeThumbnails,
  movieThumbnails,
  collectionThumbnails,
} from "./rail.fixtures";
import {
  MovieThumbnail as MovieThumbnailComponent,
  EpisodeThumbnail as EpisodeThumbnailComponent,
  CollectionThumbnail as CollectionThumbnailComponent,
} from "../thumbnail";

export default {
  title: "React/Rail",
  component: Rail,
  parameters: {
    // sm, md and lg Tailwind viewports covered by Chromatic
    chromatic: { viewports: [500, 800, 1200] },
  },
} as ComponentMeta<typeof Rail>;

const getMovieThumbnails = (length?: number) => {
  let arr = movieThumbnails;
  if (length) {
    arr = Array.from({ length }, (_, index) => ({
      ...movieThumbnails[index % movieThumbnails.length],
    }));
  }
  return arr.map((props) => (
    <MovieThumbnailComponent
      key={props.title}
      {...props}
      contentLocation="inside"
    />
  ));
};

const Template: ComponentStory<typeof Rail> = (args) => (
  <div className="flex h-[500px] w-full flex-col justify-center overflow-y-visible bg-gray-900">
    <Rail {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: getMovieThumbnails(),
};

export const ScrollOnRender = Template.bind({});
ScrollOnRender.args = {
  ...Default.args,
  initial: 3,
};

export const NoScroll = Template.bind({});
NoScroll.args = {
  children: getMovieThumbnails(4),
};

export const SingleThumbnail = Template.bind({});
SingleThumbnail.args = {
  children: getMovieThumbnails(1),
};

export const FiftyThumbnails = Template.bind({});
FiftyThumbnails.args = {
  children: getMovieThumbnails(50),
};

export const WithEpisodeThumbnails = Template.bind({});
WithEpisodeThumbnails.args = {
  children: episodeThumbnails.map((props) => (
    <EpisodeThumbnailComponent key={props.title} {...props} />
  )),
};

export const WithCollectionThumbnails = Template.bind({});
WithCollectionThumbnails.args = {
  children: collectionThumbnails.map((props) => (
    <CollectionThumbnailComponent key={props.title} {...props} />
  )),
};
