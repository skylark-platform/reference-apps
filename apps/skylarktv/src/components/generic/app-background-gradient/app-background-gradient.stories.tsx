import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AppBackgroundGradient } from "./app-background-gradient.component";

export default {
  title: "React/AppBackgroundGradient",
  component: AppBackgroundGradient,
} as ComponentMeta<typeof AppBackgroundGradient>;

const Template: ComponentStory<typeof AppBackgroundGradient> = (args) => (
  <AppBackgroundGradient {...args} />
);

export const Default = Template.bind({});
