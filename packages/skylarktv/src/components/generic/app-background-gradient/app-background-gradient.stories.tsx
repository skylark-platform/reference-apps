import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { AppBackgroundGradient } from "./app-background-gradient.component";

export default {
  title: "React/AppBackgroundGradient",
  component: AppBackgroundGradient,
} as Meta<typeof AppBackgroundGradient>;

const Template: StoryFn<typeof AppBackgroundGradient> = (args) => (
  <AppBackgroundGradient {...args} />
);

export const Default = Template.bind({});
