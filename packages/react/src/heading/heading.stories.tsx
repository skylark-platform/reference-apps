import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Heading } from "./heading.component";

export default {
  title: "react/Heading",
  component: Heading,
  argTypes: {},
} as ComponentMeta<typeof Heading>;

const Template: ComponentStory<typeof Heading> = (args) => (
  <Heading {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Heading",
  level: 1,
};
