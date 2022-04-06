import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Subtitle as SubtitleComponent } from "./subtitle.component";

export default {
  title: "React/Typography/Subtitle",
  component: SubtitleComponent,
} as ComponentMeta<typeof SubtitleComponent>;

const Template: ComponentStory<typeof SubtitleComponent> = (args) => (
  <SubtitleComponent {...args} />
);

export const Subtitle = Template.bind({});
Subtitle.args = {
  children: "Subtitle",
  level: 1,
};
