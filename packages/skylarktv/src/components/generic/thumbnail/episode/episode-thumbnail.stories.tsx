import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { EpisodeThumbnail as EpisodeThumbnailComponent } from "./episode-thumbnail.component";

export default {
  title: "React/Thumbnails/Episode",
  component: EpisodeThumbnailComponent,
} as Meta<typeof EpisodeThumbnailComponent>;

const Template: StoryFn<typeof EpisodeThumbnailComponent> = (args) => (
  <div className="mt-10 flex h-72 w-full flex-col justify-center overflow-y-visible">
    <div className="w-96 bg-gray-900 p-10">
      <EpisodeThumbnailComponent {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  href: "/",
  title: "Episode Title",
  number: 1,
  backgroundImage: "/episodes/GOT%20-%20S1%20-%201.png",
  description:
    "Series Premiere. Lord Ned Stark is troubled by disturbing reports from a Night's Watch deserter.",
  duration: "55m",
  releaseDate: "22 Jan 2022",
};

export const WithoutNumber = Template.bind({});
WithoutNumber.args = {
  href: "/",
  title: "Episode Title",
  backgroundImage: "/episodes/GOT%20-%20S1%20-%201.png",
  description:
    "Series Premiere. Lord Ned Stark is troubled by disturbing reports from a Night's Watch deserter.",
  duration: "55m",
  releaseDate: "22 Jan 2022",
};
