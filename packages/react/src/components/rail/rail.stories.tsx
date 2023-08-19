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
import { ThumbnailProps } from "../thumbnail/base/base-thumbnail.component";

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

export const FiftyThumbnailsRTL = Template.bind({});
FiftyThumbnailsRTL.args = {
  children: getMovieThumbnails(50),
  forceRtl: true,
};

export const WithEpisodeThumbnails = Template.bind({});
WithEpisodeThumbnails.args = {
  children: episodeThumbnails.map((props) => (
    <EpisodeThumbnailComponent key={props.title} {...props} />
  )),
};

export const WithEpisodeThumbnailsRTL = Template.bind({});
WithEpisodeThumbnailsRTL.args = {
  children: episodeThumbnails.map((props) => (
    <EpisodeThumbnailComponent key={props.title} {...props} />
  )),
  forceRtl: true,
};

export const WithCollectionThumbnails = Template.bind({});
WithCollectionThumbnails.args = {
  children: collectionThumbnails.map((props: ThumbnailProps) => (
    <CollectionThumbnailComponent key={props.title} {...props} />
  )),
};

export const WithCollectionThumbnailsRTL = Template.bind({});
WithCollectionThumbnailsRTL.args = {
  children: collectionThumbnails.map((props: ThumbnailProps) => (
    <CollectionThumbnailComponent key={props.title} {...props} />
  )),
  forceRtl: true,
};

export const WithHeader = Template.bind({});
WithHeader.args = {
  ...Default.args,
  header: "Movies",
};

export const WithHeaderAndCount = Template.bind({});
WithHeaderAndCount.args = {
  ...WithHeader.args,
  displayCount: true,
};

export const WithHeaderAndCountRTL = Template.bind({});
WithHeaderAndCountRTL.args = {
  ...WithHeader.args,
  displayCount: true,
  forceRtl: true,
};

export const WithText = Template.bind({});
WithText.args = {
  children: [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ].map((text) => (
    <p className="border border-white py-10 text-center text-white" key={text}>
      {text}
    </p>
  )),
};
