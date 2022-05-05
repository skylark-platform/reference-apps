import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Player } from "./player.component";

export default {
  title: "React/Player",
  component: Player,
  parameters: {
    chromatic: { delay: 1000 },
  },
} as ComponentMeta<typeof Player>;

const Template: ComponentStory<typeof Player> = (args) => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
    <Player {...args} />
  </div>
);

// From https://gist.github.com/jsturgis/3b19447b304616f18657
const video = {
  title: "Elephant Dream",
  src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
};

export const Default = Template.bind({});
Default.args = {
  src: video.src,
  videoId: "1",
  videoTitle: video.title,
};

export const WithPoster = Template.bind({});
WithPoster.args = {
  ...Default.args,
  poster: "/movies/Movie%201.png",
};
