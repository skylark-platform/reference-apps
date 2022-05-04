import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Player } from "./player.component";

export default {
  title: "React/Player",
  component: Player,
} as ComponentMeta<typeof Player>;

const Template: ComponentStory<typeof Player> = (args) => (
  <div className="flex w-screen h-screen bg-gray-900 justify-center items-center">
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
