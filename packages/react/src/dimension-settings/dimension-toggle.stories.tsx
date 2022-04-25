import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DimensionSettings } from "./dimension-settings.component";

export default {
  title: "React/DimensionSettings",
  component: DimensionSettings,
} as ComponentMeta<typeof DimensionSettings>;

const Template: ComponentStory<typeof DimensionSettings> = (args) => (
  <DimensionSettings {...args} />
);

export const Default = Template.bind({});
