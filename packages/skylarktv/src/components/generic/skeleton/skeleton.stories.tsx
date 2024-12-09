import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Skeleton } from "./skeleton.component";

export default {
  title: "React/Skeleton",
  component: Skeleton,
} as Meta<typeof Skeleton>;

const Template: StoryFn<typeof Skeleton> = (args) => (
  <div className="w-32">
    <Skeleton {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  show: true,
};

export const Portrait = Template.bind({});
Portrait.args = {
  ...Default.args,
  isPortrait: true,
};
