import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Navigation } from "./navigation.component";

export default {
  title: "React/Navigation",
  component: Navigation,
} as ComponentMeta<typeof Navigation>;

const Template: ComponentStory<typeof Navigation> = (args) => (
  <div className="h-screen w-screen bg-gray-500 md:h-48 md:w-full" dir="ltr">
    <Navigation {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  links: [
    { text: "Discover", href: "/" },
    { text: "Movies", href: "/movies" },
    { text: "TV Shows", href: "/tvshows" },
  ],
  defaultOpen: true,
};

export const WithActive = Template.bind({});
WithActive.args = {
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
