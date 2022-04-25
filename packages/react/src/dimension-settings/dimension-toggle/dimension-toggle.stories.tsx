import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DimensionToggle } from "./dimension-toggle.component";

export default {
  title: "React/DimensionSettings/DimensionToggle",
  component: DimensionToggle,
} as ComponentMeta<typeof DimensionToggle>;

const Template: ComponentStory<typeof DimensionToggle> = (args) => (
  <div className="flex h-32 w-32 items-center justify-center bg-gray-900">
    <DimensionToggle {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  // eslint-disable-next-line no-alert
  onClick: () => window.alert("Button clicked"),
};
