import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MdHome, MdMovie, MdOutlineStar, MdSearch } from "react-icons/md";
import { Navigation, NavigationLink } from "./navigation.component";

export default {
  title: "React/Navigation",
  component: Navigation,
} as ComponentMeta<typeof Navigation>;

const links: NavigationLink[] = [
  { text: "Discover", href: "/", icon: <MdHome /> },
  { text: "Movies", href: "/movies", icon: <MdMovie /> },
  {
    text: "Featured",
    href: "/featured",
    icon: <MdOutlineStar />,
  },
  {
    text: "Search",
    onClick: () => "",
    icon: <MdSearch />,
    isMobileOnly: true,
  },
];

const Template: ComponentStory<typeof Navigation> = (args) => (
  <div className="h-screen w-screen bg-gray-500 md:h-48 md:w-full" dir="ltr">
    <Navigation {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  links,
};

export const WithActive = Template.bind({});
WithActive.args = {
  links,
  activeHref: "/",
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
