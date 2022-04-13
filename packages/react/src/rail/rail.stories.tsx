import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Rail } from "./rail.component";

export default {
  title: "React/Rail",
  component: Rail,
} as ComponentMeta<typeof Rail>;

const Template: ComponentStory<typeof Rail> = (args) => (
  <div className="w-full h-96 bg-gray-900 flex flex-col justify-center overflow-y-visible">
    <Rail {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  thumbnails: [
    {
      href: "/",
      title: "Tenet",
      backgroundImage: "/movies/Movie%201.png",
    },
    {
      href: "/",
      title: "Emma",
      backgroundImage: "/movies/Movie%202.png",
    },
    {
      href: "/",
      title: "Cruella",
      backgroundImage: "/movies/Movie%203.png",
    },
    {
      href: "/",
      title: "Mank",
      backgroundImage: "/movies/Movie%204.png",
    },
    {
      href: "/",
      title: "Movie Title",
      backgroundImage: "/movies/Movie%205.png",
    },
    {
      href: "/",
      title: "Tenet",
      backgroundImage: "/movies/Movie%206.png",
    },
    {
      href: "/",
      title: "Emma",
      backgroundImage: "/movies/Movie%207.png",
    },
    {
      href: "/",
      title: "Cruella",
      backgroundImage: "/movies/Movie%208.png",
    },
    {
      href: "/",
      title: "Mank",
      backgroundImage: "/movies/Movie%209.png",
    },
    {
      href: "/",
      title: "Movie Title",
      backgroundImage: "/movies/Movie%2010.png",
    },
  ]
};
