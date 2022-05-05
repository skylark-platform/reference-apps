import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MdArrowDropDownCircle, MdCalendarToday } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { MetadataPanel } from "./metadata-panel.component";

export default {
  title: "React/MetadataPanel",
  component: MetadataPanel,
} as ComponentMeta<typeof MetadataPanel>;

const Template: ComponentStory<typeof MetadataPanel> = (args) => (
  <MetadataPanel {...args} />
);

export const Default = Template.bind({});
Default.args = {
  content: [
    {
      icon: <MdArrowDropDownCircle />,
      header: "Key Cast",
      body: "Michelle Fairley, Lena Headey, Emilia Clarke, Iain Glen, Harry Lloyd ",
    },
    {
      icon: <MdArrowDropDownCircle />,
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
      icon: <FaPen />,
      header: "Writers",
      body: "Mark Huffam, Carolyn Strauss, Joanna Burn, Frank Doelger, Guymon Casady",
    },
    {
      icon: <MdCalendarToday />,
      header: "Realeased",
      body: "10 April 2011",
    },
  ],
};
