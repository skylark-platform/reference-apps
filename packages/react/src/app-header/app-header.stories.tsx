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

export const Default = Template.bind({});
Default.args = {
  title: "StreamTV",
  links: [
    { text: "Discover", href: "/" },
    { text: "Movies", href: "/movies" },
    { text: "TV Shows", href: "/tvshows" },
  ],
  activeHref: "/",
  defaultOpen: true,
};

export const Mobile = Template.bind({});
Mobile.args = {
  ...Default.args,
};
Mobile.parameters = {
  chromatic: { viewports: [320] },
  viewport: {
    defaultViewport: "mobile1",
  },
};
