import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Skeleton } from "./skeleton.component";

export default {
  title: "React/Skeleton",
  component: Skeleton,
} as ComponentMeta<typeof Skeleton>;

const Template: ComponentStory<typeof Skeleton> = (args) => (
  <Skeleton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  show: true,
};
Default.parameters = {
  chromatic: { delay: 1000 }, // To let animation finish
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  ...Default.args,
  // title: "StreamTV",
};
WithTitle.parameters = {
  chromatic: { delay: 5000 }, // To let animation finish
};
