import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MovieThumbnail as MovieThumbnailComponent } from "./movie-thumbnail.component";
import { allMovieBackgroundImages } from "../../rail/rail.fixtures";

export default {
  title: "React/Thumbnails/Movie",
  component: MovieThumbnailComponent,
  argTypes: {
    backgroundImage: {
      options: allMovieBackgroundImages,
      control: { type: "select" },
    },
    contentLocation: {
      options: ["inside", "below"],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof MovieThumbnailComponent>;

const Template: ComponentStory<typeof MovieThumbnailComponent> = (args) => (
  <div className="mt-10 flex h-72 w-full flex-col justify-center overflow-y-visible">
    <div className="w-96 bg-gray-900 p-10">
      <MovieThumbnailComponent {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  href: "/",
  title: "Video Title",
  backgroundImage: "/movies/Movie%201.png",
  contentLocation: "inside",
  subtitle: "by Talent Name",
  tags: ["XX weeks", "Easy"],
};

export const WithContentBelow = Template.bind({});
WithContentBelow.args = {
  href: "/",
  title: "Video Title",
  backgroundImage: "/movies/Movie%205.png",
  contentLocation: "below",
  subtitle: "by Talent Name",
  tags: ["XX weeks", "Easy"],
  duration: "1h 26m",
  releaseDate: "2020",
  callToAction: {
    text: "Watch now",
  },
};

export const WithContentBelowHoverState = Template.bind({});
WithContentBelowHoverState.args = {
  ...WithContentBelow.args,
};
WithContentBelowHoverState.parameters = { pseudo: { hover: true } };
