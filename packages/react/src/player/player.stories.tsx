import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Player } from "./player.component";

export default {
  title: "React/Player",
  component: Player,
  parameters: {
    // MuxPlayer doesn't play well with the snapshot (shows blank)
    chromatic: { disableSnapshot: true },
  },
} as ComponentMeta<typeof Player>;

const Template: ComponentStory<typeof Player> = (args) => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
    <Player {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  src: "/mux-video-intro.mp4",
  videoId: "1",
  videoTitle: "Mux Video Intro",
};

export const WithPoster = Template.bind({});
WithPoster.args = {
  ...Default.args,
  poster: "/movies/Movie%201.png",
};
