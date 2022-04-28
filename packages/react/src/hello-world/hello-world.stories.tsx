import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { HelloWorld } from "./hello-world.component";

export default {
  title: "React/HelloWorld",
  component: HelloWorld,
} as ComponentMeta<typeof HelloWorld>;

const Template: ComponentStory<typeof HelloWorld> = (args) => (
  <div className="h-screen w-screen bg-gray-900">
    <HelloWorld {...args} />
  </div>
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
