import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { DimensionContent } from "./dimension-content.component";

export default {
  title: "React/DimensionSettings/DimensionContent",
  component: DimensionContent,
} as Meta<typeof DimensionContent>;

const Template: StoryFn<typeof DimensionContent> = (args) => (
  <DimensionContent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Hello world",
  label: "Location",
};
