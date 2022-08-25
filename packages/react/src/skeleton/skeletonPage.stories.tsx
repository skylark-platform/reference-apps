import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SkeletonPage } from "./skeletonPage.component";

export default {
  title: "React/SkeletonPage",
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
