import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SkeletonPage } from "./skeletonPage.component";

export default {
  title: "React/Skeleton",
  component: SkeletonPage,
} as ComponentMeta<typeof SkeletonPage>;

const Template: ComponentStory<typeof SkeletonPage> = (args) => (
  <SkeletonPage {...args} />
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
