import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MdClear } from "react-icons/md";
import { Button } from "./button.component";

export default {
  title: "React/Button",
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
    variant: {
      options: ["primary", "secondary"],
      control: { type: "radio" },
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
  variant: "primary",
};

export const Tertiary = Template.bind({});
Default.args = {
  text: "Button name",
  icon: undefined,
  size: "lg",
  iconPlacement: "left",
  disabled: false,
  onClick,
  variant: "tertiary",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  text: "Button name",
  icon: <MdClear />,
  size: "lg",
  iconPlacement: "left",
  disabled: false,
  onClick,
  variant: "primary",
};

export const OnlyIcon = Template.bind({});
OnlyIcon.args = {
  text: "",
  icon: <MdClear />,
  size: "lg",
  iconPlacement: "left",
  disabled: false,
  onClick,
  variant: "primary",
};

export const Disabled = Template.bind({});
Disabled.args = {
  text: "Button name",
  icon: <MdClear />,
  size: "lg",
  iconPlacement: "left",
  disabled: true,
  onClick,
  variant: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: "Button name",
  icon: <MdClear />,
  size: "lg",
  iconPlacement: "right",
  onClick,
  variant: "secondary",
};

export const Hover = Template.bind({});
Hover.args = {
  ...WithIcon.args,
};
Hover.parameters = { pseudo: { hover: true } };
