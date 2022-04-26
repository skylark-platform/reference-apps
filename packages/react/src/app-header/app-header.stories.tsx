import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AppHeader } from "./app-header.component";

export default {
  title: "React/AppHeader",
  component: AppHeader,
} as ComponentMeta<typeof AppHeader>;

const Template: ComponentStory<typeof AppHeader> = (args) => (
  <AppHeader {...args} />
);

export const LargeScreen = Template.bind({});
LargeScreen.args = {
  // eslint-disable-next-line no-alert
  onClick: () => window.alert("Button clicked"),
  title: "StreamTV",
};

export const Tablet = Template.bind({});
Tablet.args = {
  // eslint-disable-next-line no-alert
  onClick: () => window.alert("Button clicked"),
  title: "StreamTV",
};
Tablet.parameters = {
  chromatic: { viewports: [1200] },
  viewport: {
    defaultViewport: "tablet",
  },
};

export const Mobile = Template.bind({});
Mobile.args = {
  title: "StreamTV",
};
Mobile.parameters = {
  chromatic: { viewports: [320] },
  viewport: {
    defaultViewport: "mobile1",
  },
};
