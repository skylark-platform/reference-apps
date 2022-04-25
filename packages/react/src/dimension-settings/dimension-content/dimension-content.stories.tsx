import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DimensionContent } from "./dimension-content.component";

export default {
  title: "React/DimensionSettings/DimensionContent",
  component: DimensionContent,
} as ComponentMeta<typeof DimensionContent>;

const Template: ComponentStory<typeof DimensionContent> = (args) => (
  <DimensionContent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Hello world",
  label: "Location",
};
