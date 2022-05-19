import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MediaPlayerContent } from "./media-player-content.component";

export default {
  title: "React/MediaPlayerContent",
  component: MediaPlayerContent,
} as ComponentMeta<typeof MediaPlayerContent>;

const Template: ComponentStory<typeof MediaPlayerContent> = (args) => (
  <MediaPlayerContent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  inProgress: true,
  season: 1,
  episodeNumber: 1,
  episodeName: "Winter is Coming",
};
