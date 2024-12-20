import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { List } from "./list.component";

export default {
  title: "React/List",
  component: List,
} as Meta<typeof List>;

const Template: StoryFn<typeof List> = (args) => (
  <div className="bg-gray-900 p-6">
    <List {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  contents: ["one", "two", "three"],
};

export const FirstItemHighlighted = Template.bind({});
FirstItemHighlighted.args = {
  ...Default.args,
  highlightFirst: true,
};

export const AllItemsHighlighted = Template.bind({});
AllItemsHighlighted.args = {
  ...Default.args,
  highlightAll: true,
};
