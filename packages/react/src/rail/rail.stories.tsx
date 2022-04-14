import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Rail } from "./rail.component";
import { thumbnails } from "./rail.fixtures";

export default {
  title: "React/Rail",
  component: Rail,
  parameters: {
    // sm, md and lg Tailwind viewports covered by Chromatic
    chromatic: { viewports: [500, 800, 1200] },
  },
} as ComponentMeta<typeof Rail>;

const Template: ComponentStory<typeof Rail> = (args) => (
  <div className="flex h-96 w-full flex-col justify-center overflow-y-visible bg-gray-900">
    <Rail {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  thumbnails,
};

export const ScrollOnRender = Template.bind({});
ScrollOnRender.args = {
  thumbnails,
  initial: 3,
};

export const NoScroll = Template.bind({});
NoScroll.args = {
  thumbnails: Array.from({ length: 4 }, (_, index) => ({
    ...thumbnails[index % thumbnails.length],
  })),
};

export const With1Thumbnail = Template.bind({});
With1Thumbnail.args = {
  thumbnails: [thumbnails[0]],
};

export const With50Thumbnails = Template.bind({});
With50Thumbnails.args = {
  thumbnails: Array.from({ length: 50 }, (_, index) => ({
    ...thumbnails[index % thumbnails.length],
    id: `${index}`,
    title: `${index + 1}`,
  })),
};
