import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { DimensionSettings } from "./dimension-settings.component";

export default {
  title: "React/DimensionSettings",
  component: DimensionSettings,
} as Meta<typeof DimensionSettings>;

const Template: StoryFn<typeof DimensionSettings> = (args) => (
  <div className="h-screen w-screen bg-gray-900">
    <DimensionSettings {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  skylarkApiUrl: "https://skylark.com/api",
};

export const WithShow = Template.bind({});
WithShow.args = {
  show: true,
};

export const WithTimeTravel = Template.bind({});
WithTimeTravel.args = {
  show: true,
  timeTravelEnabled: true,
};
