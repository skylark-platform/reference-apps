import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Navigation } from "./navigation.component";

export default {
  title: "React/Navigation",
  component: Navigation,
  parameters: {
    chromatic: { viewports: [320, 1200] },
  },
} as ComponentMeta<typeof Navigation>;

const Template: ComponentStory<typeof Navigation> = (args) => (
  <Navigation {...args} />
);

export const Default = Template.bind({});
Default.args = {
  links: [
    { text: "Discover", href: "/" },
    { text: "Movies", href: "/" },
    { text: "TV Shows", href: "/" },
  ],
};
