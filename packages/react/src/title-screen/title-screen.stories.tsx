import React from "react";
import { MdStream } from "react-icons/md";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TitleScreen } from "./title-screen.component";

export default {
  title: "React/TitleScreen",
  component: TitleScreen,
} as ComponentMeta<typeof TitleScreen>;

const Template: ComponentStory<typeof TitleScreen> = (args) => (
  <TitleScreen {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: "StreamTV",
};
Default.parameters = {
  chromatic: { disableSnapshot: true },
};

export const WithLogo = Template.bind({});
WithLogo.args = {
  ...Default.args,
  logo: (
    <MdStream className="h-12 w-12 rounded-md bg-purple-500 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
  ),
};
WithLogo.parameters = {
  ...Default.parameters,
};
