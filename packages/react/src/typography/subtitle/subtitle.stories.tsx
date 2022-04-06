import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Subtitle as SubtitleComponent } from "./subtitle.component";

export default {
  title: "React/Typography/Subtitle",
  component: SubtitleComponent,
} as ComponentMeta<typeof SubtitleComponent>;

const Template: ComponentStory<typeof SubtitleComponent> = (args) => (
  <SubtitleComponent {...args}>{`Subtitle ${args.level}`}</SubtitleComponent>
);

export const Level1 = Template.bind({});
Level1.args = {
  level: 1,
};

export const Level2 = Template.bind({});
Level2.args = {
  level: 2,
};

export const Level3 = Template.bind({});
Level3.args = {
  level: 3,
};
