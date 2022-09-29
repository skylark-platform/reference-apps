import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoadingScreen } from "./loading-screen.component";

export default {
  title: "React/LoadingScreen",
  component: LoadingScreen,
} as ComponentMeta<typeof LoadingScreen>;

const Template: ComponentStory<typeof LoadingScreen> = (args) => (
  <LoadingScreen {...args} />
);

export const Default = Template.bind({});
Default.args = {
  show: true,
};
Default.parameters = {
  chromatic: { delay: 1000 }, // To let animation finish
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  ...Default.args,
  title: "StreamTV",
};
WithTitle.parameters = {
  chromatic: { delay: 5000 }, // To let animation finish
};
