import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { NavigationToggle } from "./navigation-toggle.component";

export default {
  title: "React/Navigation/Toggle",
  component: NavigationToggle,
} as Meta<typeof NavigationToggle>;

const Template: StoryFn<typeof NavigationToggle> = (args) => (
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
