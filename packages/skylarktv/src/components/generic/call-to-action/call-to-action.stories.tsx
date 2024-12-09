import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { CallToAction } from "./call-to-action.component";

export default {
  title: "React/CallToAction",
  component: CallToAction,
} as Meta<typeof CallToAction>;

const Template: StoryFn<typeof CallToAction> = (args) => (
  <div className="bg-gray-900">
    <CallToAction {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  inProgress: false,
  seasonNumber: 1,
  episodeNumber: 1,
  episodeTitle: "Winter is Coming",
};

export const WithHref = Template.bind({});
WithHref.args = {
  inProgress: false,
  seasonNumber: 1,
  episodeNumber: 1,
  episodeTitle: "Winter is Coming",
  href: "/",
};
