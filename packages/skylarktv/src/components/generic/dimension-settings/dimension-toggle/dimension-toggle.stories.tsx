import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { DimensionToggle } from "./dimension-toggle.component";

export default {
  title: "React/DimensionSettings/DimensionToggle",
  component: DimensionToggle,
} as Meta<typeof DimensionToggle>;

const Template: StoryFn<typeof DimensionToggle> = (args) => (
  <div className="flex h-32 w-32 items-center justify-center bg-gray-900">
    <DimensionToggle {...args} />
  </div>
);

export const Open = Template.bind({});
Open.args = {
  variant: "open",
  // eslint-disable-next-line no-alert
  onClick: () => window.alert("Button clicked"),
};

export const Close = Template.bind({});
Close.args = {
  variant: "close",
  // eslint-disable-next-line no-alert
  onClick: () => window.alert("Button clicked"),
};
