import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RadioButton } from "./radio-button.component";

export default {
  title: "React/RadioButton",
  component: RadioButton,
} as ComponentMeta<typeof RadioButton>;

const Template: ComponentStory<typeof RadioButton> = (args) => (
  <RadioButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  options: ["Current", "Tomorrow"],
  onChange: (value: string) => console.log(value),
};
