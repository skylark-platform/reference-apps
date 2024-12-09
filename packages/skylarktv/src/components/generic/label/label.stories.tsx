import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { MdClear } from "react-icons/md";
import { Label } from "./label.component";

export default {
  title: "React/Label",
  component: Label,
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
} as Meta<typeof Label>;

const Template: StoryFn<typeof Label> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: "Label name",
  icon: undefined,
  iconPlacement: "left",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  text: "Label name",
  icon: <MdClear />,
  iconPlacement: "left",
};

export const OnlyIcon = Template.bind({});
OnlyIcon.args = {
  text: "",
  icon: <MdClear />,
  iconPlacement: "left",
};
