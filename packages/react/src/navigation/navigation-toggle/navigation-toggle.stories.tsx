import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { NavigationToggle } from "./navigation-toggle.component";

export default {
  title: "React/Navigation/Toggle",
  component: NavigationToggle,
} as ComponentMeta<typeof NavigationToggle>;

const Template: ComponentStory<typeof NavigationToggle> = (args) => (
  <NavigationToggle {...args} />
);

export const Open = Template.bind({});
Open.args = {
  variant: "open",
};

export const Close = Template.bind({});
Close.args = {
  variant: "close",
};
