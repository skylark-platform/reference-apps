import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MdClear } from "react-icons/md";
import { Label } from "./label.component";

export default {
  title: "react/Label",
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
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

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
