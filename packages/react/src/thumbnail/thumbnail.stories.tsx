import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Thumbnail } from "./thumbnail.component";
import { allBackgroundImages } from "../rail/rail.fixtures";

export default {
  title: "React/Thumbnail",
  component: Thumbnail,
  argTypes: {
    backgroundImage: {
      options: allBackgroundImages,
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof Thumbnail>;

const Template: ComponentStory<typeof Thumbnail> = (args) => (
  <Thumbnail {...args} />
);

export const Default = Template.bind({});
Default.args = {
  href: "/",
  title: "Video Title",
  backgroundImage: "/movies/Movie%201.png",
  width: "w-96",
};

export const WithSubtitleAndTags = Template.bind({});
WithSubtitleAndTags.args = {
  ...Default.args,
  subtitle: "by Talent Name",
  tags: ["XX weeks", "Easy"],
};

export const WithHoverState = Template.bind({});
WithHoverState.args = {
  ...WithSubtitleAndTags.args,
};
WithHoverState.parameters = { pseudo: { hover: true } };
