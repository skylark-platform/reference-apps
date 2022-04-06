import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Heading as HeadingComponent } from "./heading.component";

export default {
  title: "React/Typography/Heading",
  component: HeadingComponent,
} as ComponentMeta<typeof HeadingComponent>;

const Template: ComponentStory<typeof HeadingComponent> = (args) => (
  <HeadingComponent {...args} />
);

export const Heading = Template.bind({});
Heading.args = {
  children: "Heading",
  level: 1,
};
