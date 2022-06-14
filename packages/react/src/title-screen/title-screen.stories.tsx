import React from "react";
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
  show: true,
  title: "StreamTV",
};
Default.parameters = {
  chromatic: { delay: 2000 }, // To let animation finish
};
