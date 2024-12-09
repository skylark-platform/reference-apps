import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import {
  MdRecentActors,
  MdCalendarToday,
  MdMovie,
  MdMode,
} from "react-icons/md";
import { MetadataPanel } from "./metadata-panel.component";

export default {
  title: "React/MetadataPanel",
  component: MetadataPanel,
} as Meta<typeof MetadataPanel>;

const Template: StoryFn<typeof MetadataPanel> = (args) => (
  <div dir="ltr">
    <MetadataPanel {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  content: [
    {
      icon: <MdRecentActors />,
      header: "Key Cast",
      body: "Michelle Fairley, Lena Headey, Emilia Clarke, Iain Glen, Harry Lloyd ",
    },
    {
      icon: <MdMovie />,
      header: "Producers",
      body: [
        "Mark Huffam",
        "Carolyn Strauss",
        "Joanna Burn",
        "Frank Doelger",
        "Guymon Casady",
      ],
    },
    {
      icon: <MdMode />,
      header: "Writers",
      body: "Mark Huffam, Carolyn Strauss, Joanna Burn, Frank Doelger, Guymon Casady",
    },
    {
      icon: <MdCalendarToday />,
      header: "Released",
      body: "10 April 2011",
    },
  ],
};
