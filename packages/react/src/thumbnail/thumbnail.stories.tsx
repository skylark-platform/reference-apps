import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Thumbnail } from "./thumbnail.component";

export default {
  title: "React/Thumbnail",
  component: Thumbnail,
} as ComponentMeta<typeof Thumbnail>;

const Template: ComponentStory<typeof Thumbnail> = (args) => (
  <Thumbnail {...args} />
);

export const Default = Template.bind({});
Default.args = {
  href: "/",
  title: "Video Title",
  backgroundImage: "/movies/Movie%201.png",
};

export const WithSubtitleAndTags = Template.bind({});
WithSubtitleAndTags.args = {
  href: "/",
  title: "Video Title",
  backgroundImage: "/movies/Movie%201.png",
  subtitle: "by Talent Name",
  tags: ["XX weeks", "Easy"],
};
