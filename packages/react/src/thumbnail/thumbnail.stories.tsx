import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MdClear } from "react-icons/md";
import { Thumbnail } from "./thumbnail.component";

export default {
  title: "React/MediaItem",
  component: Thumbnail,
  argTypes: {
    iconPlacement: {
      options: ["left", "right"],
      control: { type: "radio" },
    },
    icon: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Thumbnail>;

const Template: ComponentStory<typeof Thumbnail> = (args) => (
  <Thumbnail {...args} />
);

export const Default = Template.bind({});
Default.args = {
  text: "Label name",
  icon: undefined,
  iconPlacement: "left",
};
