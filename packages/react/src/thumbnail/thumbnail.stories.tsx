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
    contentLocation: {
      options: ["inside", "below"],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof Thumbnail>;

const Template: ComponentStory<typeof Thumbnail> = (args) => (
  <div className="flex h-72 w-full flex-col justify-center overflow-y-visible mt-10">
    <div className="p-10 bg-gray-900">
      <Thumbnail {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  href: "/",
  title: "Video Title",
  backgroundImage: "/movies/Movie%201.png",
  width: "w-96",
  contentLocation: "inside",
};

export const WithSubtitleAndTags = Template.bind({});
WithSubtitleAndTags.args = {
  ...Default.args,
  subtitle: "by Talent Name",
  tags: ["XX weeks", "Easy"],
};

export const WithCallToAction = Template.bind({});
WithCallToAction.args = {
  ...Default.args,
  callToAction: "Watch for free",
};

export const WithHoverState = Template.bind({});
WithHoverState.args = {
  ...WithSubtitleAndTags.args,
};
WithHoverState.parameters = { pseudo: { hover: true } };
