import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DimensionRadioButton } from "./dimension-radio-button.component";

export default {
  title: "React/DimensionSettings/RadioButton",
  component: DimensionRadioButton,
} as ComponentMeta<typeof DimensionRadioButton>;

const Template: ComponentStory<typeof DimensionRadioButton> = (args) => (
  <DimensionRadioButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  options: [{ text: "Current", value: "current" }, { text: "Tomorrow", value: "tomorrow" }],
  onChange: (value: string) => console.log(value),
};
