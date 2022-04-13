import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Heading as HeadingComponent } from "./heading.component";

export default {
  title: "React/Typography/Heading",
  component: HeadingComponent,
  parameters: {
    chromatic: { viewports: [320, 1200] },
  },
} as ComponentMeta<typeof HeadingComponent>;

const Template: ComponentStory<typeof HeadingComponent> = (args) => (
  <HeadingComponent {...args} className="text-gray-900">{`Heading ${args.level}`}</HeadingComponent>
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

export const Level4 = Template.bind({});
Level4.args = {
  level: 4,
};

export const Level5 = Template.bind({});
Level5.args = {
  level: 5,
};

export const Level6 = Template.bind({});
Level6.args = {
  level: 6,
};
