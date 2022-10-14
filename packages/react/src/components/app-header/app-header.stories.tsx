import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MdStream, MdAccountCircle } from "react-icons/md";
import { AppHeader } from "./app-header.component";
import { Button } from "../button";

export default {
  title: "React/AppHeader",
  component: AppHeader,
} as ComponentMeta<typeof AppHeader>;

const Template: ComponentStory<typeof AppHeader> = (args) => (
  <AppHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  links: [
    { text: "Discover", href: "/" },
    { text: "Movies", href: "/movies" },
    { text: "TV Shows", href: "/tvshows" },
  ],
  activeHref: "/",
  defaultOpen: true,
  children: (
    <>
      <div className="flex items-center justify-center text-3xl text-gray-100">
        <MdStream className="h-9 w-9 md:ml-8 md:h-10 md:w-10 lg:ml-16 lg:h-12 lg:w-12 xl:ml-20" />
        <h2 className="ml-1 text-base md:ml-2 md:text-xl lg:text-2xl">
          <a>{`StreamTV`}</a>
        </h2>
        <span className="absolute right-2 md:hidden">
          <Button
            icon={<MdAccountCircle size={20} />}
            size="sm"
            variant="tertiary"
          />
        </span>
      </div>
      <div className="hidden gap-1 md:flex">
        <Button icon={<MdAccountCircle size={25} />} text="Sign in" />
        <Button text="Register" variant="tertiary" />
      </div>
    </>
  ),
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
