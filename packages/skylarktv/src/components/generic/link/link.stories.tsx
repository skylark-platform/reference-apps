import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { Link } from "./link.component";

export default {
  title: "React/Link",
  component: Link,
} as Meta<typeof Link>;

const Template: StoryFn<typeof Link> = (args) => (
  <Link {...args} href="#example" />
);

export const Default = Template.bind({});
Default.args = {
  children: "Link",
};
