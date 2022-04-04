import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Link } from "./link.component";

export default {
  title: "react/Link",
  component: Link,
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => (
  <Link {...args} href="#example" />
);

export const Default = Template.bind({});
Default.args = {
  children: "Link",
};
