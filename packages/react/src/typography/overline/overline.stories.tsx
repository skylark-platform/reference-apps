import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Overline as OverlineComponent } from "./overline.component";

export default {
  title: "React/Typography/Overline",
  component: OverlineComponent,
} as ComponentMeta<typeof OverlineComponent>;

const Template: ComponentStory<typeof OverlineComponent> = (args) => (
  <OverlineComponent {...args} />
);

export const Overline = Template.bind({});
Overline.args = {
  children: "Overline",
  level: 1,
};
