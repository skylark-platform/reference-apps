import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { HelloWorld } from "./hello-world.component";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "react/HelloWorld",
  component: HelloWorld,
} as ComponentMeta<typeof HelloWorld>;

const Template: ComponentStory<typeof HelloWorld> = (args) => (
  <HelloWorld {...args} />
);

export const Default = Template.bind({});

export const Spinning = Template.bind({});
Spinning.args = {
  spin: true,
};

export const Pulsing = Template.bind({});
Pulsing.args = {
  pulse: true,
};
