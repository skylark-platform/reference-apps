import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MdClear } from "react-icons/md";
import { Button } from "./button.component";

export default {
  title: "react/Button",
  component: Button,
  parameters: {
    chromatic: { viewports: [320, 1200] },
  },
  argTypes: {
    size: {
      options: ["sm", "lg"],
      control: { type: "radio" },
    },
    disabled: {
      control: { type: "boolean" },
    },
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
    onClick: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

// eslint-disable-next-line no-alert
const onClick = () => window.alert("Button clicked");

export const Default = Template.bind({});
Default.args = {
  text: "Button name",
  icon: undefined,
  size: "lg",
  iconPlacement: "left",
  disabled: false,
  onClick,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  text: "Button name",
  icon: <MdClear />,
  size: "lg",
  iconPlacement: "left",
  disabled: false,
  onClick,
};

export const OnlyIcon = Template.bind({});
OnlyIcon.args = {
  text: "",
  icon: <MdClear />,
  size: "lg",
  iconPlacement: "left",
  disabled: false,
  onClick,
};

export const Disabled = Template.bind({});
Disabled.args = {
  text: "Button name",
  icon: <MdClear />,
  size: "lg",
  iconPlacement: "left",
  disabled: true,
  onClick,
};
